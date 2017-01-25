class Blueberry {

    private static _elements: DomElement[] = [];
    private static _observable: Observable[] = [];
    private static _version: string = '0.0.1';

    private static _registeredComponents: Component[] = [];
    private static _registeredAddons: Addon[] = [];
    private static _registeredServices: any[] = [];
    private static _hasInit: boolean = false;

    public static get version() {
        return this._version;
    }

    public static get registered(): Component[] {
        return this._registeredComponents;
    }

    public static get elements(): DomElement[] {
        return this._elements;
    }

    public static register(item, value): Blueberry {
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
        // Start Events
        Blueberry.created();

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
            this.createClickHandlers();
            this.createInputHandlers();
            this.addonReady();
            this._hasInit = true;
        }
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
        this.createClickHandlers();
    }

    /**
     * Adds an element to the the list of DomElements
     *
     * @static
     * @param {DomElement} domElement
     *
     * @memberOf Blueberry
     */
    public static addElement(domElement: DomElement) {
        this._elements.push(domElement);
        let attrs = domElement.attrs;
        for (let key in attrs) {
            domElement.props.set(new Property(key, attrs[key]));
        }
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
    public static findById(id: string): DomElement {
        for (let i = 0, l = this._elements.length; i < l; i++) {
            if (this._elements[i].elementId == id) {
                return this._elements[i];
            }
        }
        return null;
    }

    /**
     * Finds an element in the dom based on the selector and converts it to a Blueberry DomElement
     *
     * @static
     * @param {string} selector
     * @returns {DomElement}
     *
     * @memberOf Blueberry
     */
    public static find(selector: string): DomElement {
        let item = document.querySelector(selector) as HTMLElement;
        if (item) {
            for (let i = 0, l = Blueberry.elements.length; i < l; i++) {
                if (Blueberry.elements[i].element == item) {
                    return Blueberry.elements[i];
                }
            }
            let de = new DomElement(item);
            Blueberry.addElement(de);
            return de;
        }
        return null;
    }

    /**
     * Finds all elements in the dom based on the selector and converts them to Blueberry DomElements
     *
     * @static
     * @param {string} selector
     * @returns {DomElement[]}
     *
     * @memberOf Blueberry
     */
    public static findAll(selector: string): DomElement[] {
        let elements: DomElement[] = [];
        let items = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        for (let i = 0, l = items.length; i < l; i++) {
            let item = items[i];
            let found: boolean = false;
            for (let j = 0, len = Blueberry.elements.length; j < len; j++) {
                if (Blueberry.elements[j].element == item) {
                    elements.push(Blueberry.elements[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                let de = new DomElement(item);
                Blueberry.addElement(de);
                elements.push(de)
            }
        }
        return elements;
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
    public static findWithComponent<T extends Component>(type: ComponentType<T>): DomElement[] {
        let elements: DomElement[] = [];
        this._elements.forEach(el => {
            el.components.forEach(comp => {
                if (comp instanceof type) {
                    elements.push(el);
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
    public static findComponents<T extends Component>(type: ComponentType<T>): T[] {
        let components: T[] = [];
        this.elements.forEach(el => {
            el.components.forEach(comp => {
                if (comp instanceof type) {
                    components.push(<T>comp);
                }
            });
        });
        return components;
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
        let elen = this._elements.length;
        loop:
        for (let i = 0, l = e.length; i < l; i++) {
            for (let j = 0; j < elen; j++) {
                if (e[i] == this._elements[j].element) {
                    continue loop;
                }
            }
            this.addElement(new DomElement(e[i]));
        }
    }

    /**
     * Creates click event handlers for components that support it
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    private static createClickHandlers() {
        this._elements.forEach(element => {
            element.element.onclick = function (e) {
                element.components.forEach(component => {
                    if (typeof component['click'] == 'function') {
                        e.preventDefault();
                        component['click'].bind(component).call(component, e);
                    }
                });
            };
        });
    }

    private static createInputHandlers() {
        this._elements.forEach(element => {
            element.element.oninput = function (e) {
                element.components.forEach(component => {
                    if (typeof component['input'] == 'function' && e.currentTarget instanceof HTMLInputElement) {
                        e.preventDefault();
                        component['input'].bind(component).call(component, e.currentTarget.value, e);
                    }
                });
            };
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
    private static created() {
        this._elements.forEach(element => {
            element.sendMessage('created');
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
        let i = this._elements.length;
        while (i--) {
            let element = this._elements[i];
            element.sendMessage('deleted');
            if (element['_toDelete']) {
                this._elements.splice(i, 1);
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
        this._elements.forEach(element => {
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
        this._elements.forEach(element => {
            element.sendMessage('lateUpdate');
        });
    }

}