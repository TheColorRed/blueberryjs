class Blueberry {

    public static isActive: boolean = true;

    private static _observable: Observable[] = [];
    private static _version: string = '0.0.1';

    private static _objects: Obj[] = [];
    private static _registeredComponents: Component[] = [];
    private static _registeredAddons: Addon[] = [];
    private static _registeredServices: any[] = [];
    private static _registeredEvents: BlueberryEvent[] = [];
    private static _hasInit: boolean = false;

    public static get version() {
        return this._version;
    }

    public static get objects(): any[] {
        return this._objects;
    }

    public static get registered(): Component[] {
        return this._registeredComponents;
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
        Blueberry.addonStartTick();
        Blueberry.created();
        Blueberry.ready();

        // Update Events
        Blueberry.update();
        Blueberry.lateUpdate();

        Blueberry.deleted();

        Blueberry.addonEndTick();

        // if (Blueberry.isActive) {
        //     requestAnimationFrame(Blueberry.tick);
        // } else {
        let next = Time.nextCalc();
        setTimeout(Blueberry.tick, next);
        // }
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
            // this.initElementsWithComponent();
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
        MouseHandler.clickHandlers();
    }

    private static initKeyboard() {
        KeyboardHandler.inputHandler();
    }

    /**
     * Adds an element to the the list of DomElements
     *
     * @static
     * @param {DomElement} domElement
     *
     * @memberOf Blueberry
     */
    public static addElement(element: any) {
        this._objects.push(element);
        if (element) {
            let attrs = element.attrs;
        }
        // for (let key in attrs) {
        //     domElement.props.set(new Property(key, attrs[key]));
        // }
    }

    /**
     * Initializes elements that have not been initialized. This can run as many times as desired, as elements that have been upgraded won't be upgraded again.
     *
     * @static
     *
     * @memberOf Blueberry
     */
    // public static upgrade() {
    //     this.initElementsWithComponent();
    //     this.initHandlers();
    // }

    public static on(name: string, event: (event: BlueberryEvent) => void): Blueberry {
        this._registeredEvents.push(new BlueberryEvent(name, event));
        return Blueberry;
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
        let m: RegExpExecArray | null;
        let matches: { placeholder: string, value: string }[] = [];
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
    public static query(path: string, obj: Object | null = null) {
        let previous: Object | null = null;
        obj = !obj ? this : obj;
        for (let i = 0, p = path.split(/[\[\]\.]/), len = p.length; i < len; i++) {
            if (p[i] == '' || !obj) { continue; }
            let item = p[i];//.match(/[0-9]+/) ? path[i] : path[i];
            obj = obj[item];
            previous = obj;
        }
        return obj;
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
            if (typeof addon.init == 'function') {
                addon.init();
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
            if (typeof addon.ready == 'function') {
                addon.ready();
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

    private static addonEndTick() {
        let i = this._registeredAddons.length;
        while (i--) {
            let addon = this._registeredAddons[i];
            if (addon['endTick']) {
                addon['endTick']();
            }
        }
    }

    private static addonStartTick() {
        let i = this._registeredAddons.length;
        while (i--) {
            let addon = this._registeredAddons[i];
            if (addon['startTick']) {
                addon['startTick']();
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

    private static windowFocus() {
        this._objects.forEach(element => {
            element.sendMessage('windowFocus');
        });
    }

    private static windowBlur() {
        this._objects.forEach(element => {
            element.sendMessage('windowBlur');
        });
    }
}

window.bb = Blueberry;