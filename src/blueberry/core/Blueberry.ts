class Blueberry {

    private static _objects: DOMObject[] = [];
    private static _observable: Observable[] = [];
    private static _version: string = '0.0.1';

    private static _registeredComponents: Component[] = [];
    private static _registeredAddons: Addon[] = [];
    private static _registeredServices: any[] = [];
    private static _registeredEvents: BlueberryEvent[] = [];
    private static _hasInit: boolean = false;

    public static get version() {
        return this._version;
    }

    public static get registered(): Component[] {
        return this._registeredComponents;
    }

    public static get objects(): DOMObject[] {
        return this._objects;
    }

    public static register(item, value?): Blueberry {
        if (arguments.length == 1 && item.prototype instanceof Component) {
            this._registeredComponents[(<any>item).name] = item;
            window[(<any>item).name] = item;
        } else if (arguments.length == 2 && typeof item == 'string') {
            this._registeredServices[item] = value;
            // window[(<any>item).name] = value;
        }
        return Blueberry;
    }

    public static registerAddon<T extends Addon>(item: AddonType<T>): Blueberry {
        this._registeredAddons.push(new item());
        return Blueberry;
    }

    public static tick() {
        Time.frameTime();
        // Start Events
        Blueberry.created();
        Blueberry.ready();

        // Update Events
        Blueberry.update();
        Blueberry.lateUpdate();

        Blueberry.deleted();

        requestAnimationFrame(Blueberry.tick);
    }

    /**
     * Initializes the framework for the first time. This can and should only be run once.
     *
     * @static
     *
     * @memberOf Blueberry
     */
    public static init() {
        if (!this._hasInit) {
            this.addonInit();
            this.initServices();
            this.initElementsWithComponent();
            // this.initComponentInteravls();
            this.initHandlers();
            this.addonReady();
            this._registeredEvents.forEach(evt => {
                if (evt.name == 'ready') {
                    evt.event(evt);
                }
            });
            this._hasInit = true;
        }
    }

    private static initHandlers() {
        this.initMouse();
        this.initKeyboard();
    }

    private static initMouse() {
        Mouse.clickHandlers();
    }

    private static initKeyboard() {
        Keyboard.inputHandler();
    }

    /**
     * Initializes elements that have not been initialized. This can run as many times as desired, as elements that have been upgraded won't be upgraded again.
     *
     * @static
     *
     * @memberOf Blueberry
     */
    public static upgrade() {
        this.initElementsWithComponent();
        this.initHandlers();
    }

    public static on(name: string, event: (event: BlueberryEvent) => void): Blueberry {
        this._registeredEvents.push(new BlueberryEvent(name, event));
        return Blueberry;
    }

    /**
     * Adds an element to the the list of DomElements
     *
     * @static
     * @param {DomElement} domElement
     *
     * @memberOf Blueberry
     */
    public static addElement(domElement: DOMObject) {
        this._objects.push(domElement);
        let attrs = domElement.attrs;
        for (let key in attrs) {
            domElement.props.set(new Property(key, attrs[key]));
        }
    }

    public static toObject(element: HTMLElement): DOMObject {
        for (let i = 0, l = this._objects.length; i < l; i++) {
            if (this._objects[i].element == element) {
                return this._objects[i];
            }
        }
        let domObject = new DOMObject(element);
        this.addElement(domObject);
        return domObject;
    }

    /**
     * Generates a unique alpha-numeric string
     *
     * @static
     * @param {number} [length=6]
     * @returns {string}
     *
     * @memberOf Blueberry
     */
    public static uniqId(length: number = 6): string {
        return (Math.random().toString(36) + Math.random().toString(36)).substr(2, length);
    }

    public static findTemplateItems(template): { placeholder: string, value: string }[] {
        let regex = /\{\{(.+?)\}\}/g
        let m: RegExpExecArray;
        let matches = [];
        while ((m = regex.exec(template))) {
            if (m.index === regex.lastIndex) { regex.lastIndex++; }
            let tmp = { placeholder: '', value: '' };
            m.forEach((match, idx) => {
                if (idx == 0) {
                    tmp.placeholder = match;
                } else if (idx == 1) {
                    tmp.value = match;
                    matches.push(tmp);
                    tmp = { placeholder: '', value: '' };
                }
            });
        }
        return matches;
    }

    /**
     * Searches an object for a value based on a query string:
     * key1.key2[0].key3
     *
     * @static
     * @param {string} path
     * @param {any} [obj=null]
     * @returns
     *
     * @memberOf Blueberry
     */
    public static query(path: string, obj = null) {
        let previous = null;
        obj = !obj ? this : obj;
        for (let i = 0, p = path.split(/[\[\]\.]/), len = p.length; i < len; i++) {
            if (p[i] == '') { continue; }
            let item = p[i];//.match(/[0-9]+/) ? path[i] : path[i];
            obj = obj[item];
            previous = obj;
        }
        return obj;
    }

    /**
     * Finds a Blueberry DomElement based on it's id.
     *
     * @static
     * @param {string} id
     * @returns {DomElement}
     *
     * @memberOf Blueberry
     */
    public static findById(id: string): DOMObject {
        for (let i = 0, l = this._objects.length; i < l; i++) {
            if (this._objects[i].elementId == id) {
                return this._objects[i];
            }
        }
        return null;
    }

    public static find<T extends Component>(query: string, type: ComponentType<T>): T {
        let elements = document.querySelectorAll(query) as NodeListOf<HTMLElement>;
        for (let i = 0, l = elements.length; i < l; i++) {
            let element = elements[i];
            for (let e = 0, len = this._objects.length; e < len; e++) {
                let el = this._objects[e];
                if (element == el.element) {
                    for (let c = 0, len2 = el.components.length; c < len2; c++) {
                        if (el.components[c] instanceof type) {
                            return <T>el.components[c];
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Finds all elements that contain a particular component
     *
     * @static
     * @template T
     * @param {ComponentType<T>} type
     * @returns {DomElement[]}
     *
     * @memberOf Blueberry
     */
    public static findWithComponent<T extends Component>(type: ComponentType<T>): DOMObjectList {
        let elements = new DOMObjectList();
        this._objects.forEach(el => {
            el.components.forEach(comp => {
                if (comp instanceof type) {
                    elements.add(el);
                }
            });
        });
        return elements;
    }

    /**
     * Finds all components of a particular type
     *
     * @static
     * @template T
     * @param {ComponentType<T>} type
     * @returns {T[]}
     *
     * @memberOf Blueberry
     */
    public static findComponents<T extends Component>(type: ComponentType<T>): ComponentList {
        let list = new ComponentList();
        this.objects.forEach(el => {
            el.components.forEach(comp => {
                if (comp instanceof type) {
                    list.add(<T>comp);
                }
            });
        });
        return list;
    }

    /**
     * Runs the init method in the addon. This is the first thing to run after the dom loads.
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static addonInit() {
        this._registeredAddons.forEach(addon => {
            if (typeof addon['init'] == 'function') {
                addon['init']();
            }
        });
    }

    /**
     * Runs the ready method in the addon. This happens after all the components have initialized.
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static addonReady() {
        this._registeredAddons.forEach(addon => {
            if (typeof addon['ready'] == 'function') {
                addon['ready']();
            }
        })
    }

    /**
     * Initializes all the services that have been registered.
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static initServices() {
        for (let i in this._registeredServices) {
            window[i] = new this._registeredServices[i]();
        }
    }

    /**
     * Initializes components that have not yet been initialized
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static initElementsWithComponent() {
        let e = document.querySelectorAll('[component]') as NodeListOf<HTMLElement>;
        let elen = this._objects.length;
        loop:
        for (let i = 0, l = e.length; i < l; i++) {
            for (let j = 0; j < elen; j++) {
                if (e[i] == this._objects[j].element) {
                    continue loop;
                }
            }
            this.addElement(new DOMObject(e[i]));
        }
    }

    /**
     * Sends a created message to all components
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static created() {
        this._objects.forEach(element => {
            element.sendMessage('created');
        });
    }

    /**
     * Sends a created message to all components
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static ready() {
        this._objects.forEach(element => {
            element.sendMessage('ready');
        });
    }

    /**
     * Sends a deleted message to all components
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static deleted() {
        let i = this._objects.length;
        while (i--) {
            let element = this._objects[i];
            element.sendMessage('deleted');
            if (element['_toDelete']) {
                this._objects.splice(i, 1);
            }
        }
    }

    /**
     * Sends an update message to all components
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static update() {
        this._objects.forEach(element => {
            element.sendMessage('update');
        });
    }

    /**
     * Sends a lateUpdate message to all components
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static lateUpdate() {
        this._objects.forEach(element => {
            element.sendMessage('lateUpdate');
        });
    }

}

window.bb = Blueberry;