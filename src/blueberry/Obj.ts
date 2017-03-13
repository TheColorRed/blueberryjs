interface Obj {
    onObserve?(observable: Object, element, component: Component, key: string);
}

class Obj {

    public id: string = '';
    public element: HTMLElement;
    // public object: DOMObject;
    public object: any;

    protected _toDelete: boolean = false;

    private _props: Properties = new Properties();

    protected _components: Component[] = [];
    protected _intervals: number[] = [];

    public get elementId(): string {
        return this.object.id;
    }

    public get components(): Component[] {
        return this._components;
    }

    /**
     * Gets properties that have been added to this object
     *
     * @readonly
     * @type {Properties}
     * @memberOf BlueberryObject
     */
    // public get props(): Properties {
    //     return this.object._props;
    // }

    public static clone(obj) {
        if (null == obj || 'object' != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    /**
     * Destorys a DomElement and removes it from the dom
     *
     * @param {number} [delay=0]
     *
     * @memberOf BlueberryObject
     */
    public destroy(delay: number = 0): void {
        setTimeout(() => {
            this.object._toDelete = true;
        }, delay * 1000);
    }

    /**
     * Adds a component to the current DomElement
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {T}
     *
     * @memberOf BlueberryObject
     */
    public addComponent<T extends Component>(type: ComponentType<T>): T {
        let c = new type() as T;
        let name = (<any>c).constructor.name;
        for (let i = 0, l = this.object.components.length; i < l; i++) {
            let comp = this.object.components[i];
            if (type instanceof Component && name == (<any>comp).constructor.name && comp.unique) {
                return <T>comp;
            }
        }

        c.object = this.object;
        if (c.element) {
            c.element = this.element;
            let compAttr = (c.element.getAttribute('component') || '').split(' ');
            compAttr.push(name);
            c.element.setAttribute('component', compAttr.join(' '));
        }
        // c.init();
        this.object['_components'].push(c);
        return c;
    }

    /**
     * Removes a component from the current DomElement
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {this}
     *
     * @memberOf BlueberryObject
     */
    public removeComponent<T extends Component>(type: ComponentType<T>): this {
        let i = this.object.components.length;
        let name = (<any>type).constructor.name;
        while (i--) {
            let comp = this.object.components[i];
            if (comp instanceof Component && name == (<any>comp).constructor.name) {
                this.object.components.splice(i, 1);
                delete this.object.components[i];
            }
        }
        return this;
    }

    public getComponent<T extends Component>(type: ComponentType<T>): T | null {
        if (this.object.components) {
            for (let comp of this.object.components) {
                if (comp instanceof type) {
                    return <T>comp;
                }
            }
        }
        return null;
    }

    public initComponentInteravls() {
        this._components.forEach(comp => {
            if (typeof comp['interval'] == 'function') {
                let delay = comp['interval']();
                if (delay > 0) {
                    this._intervals[(<any>comp).constructor.name] = setInterval(() => {
                        let itmdelay = comp['interval']();
                        if (!itmdelay) {
                            clearInterval(this._intervals[(<any>comp).constructor.name]);
                        }
                    }, delay);
                }
            }
        });
    }

    /**
     * Sends a message to the elements components
     *
     * @param {string} message
     * @param {...any[]} options
     *
     * @memberOf DomElement
     */
    public sendMessage(message: string, ...options: any[]) {
        for (let i = 0, l = this._components.length; i < l; i++) {
            let comp = this._components[i];
            if (message == 'created') {
                if (comp['_started']) { return; }
                comp['_started'] = true;
                if (typeof comp['template'] == 'function') {
                    comp.setTemplates();
                }
                if (typeof comp['observe'] == 'function') {
                    comp.getObservables();
                    comp.getModels();
                }
                this.initComponentInteravls();
            }
            if (message == 'ready') {
                if (comp['_ready']) { return; }
                comp['_ready'] = true;
            }
            if (message == 'deleted') {
                if (!this._toDelete) { return; }
            }
            if (typeof comp[message] == 'function') {
                comp[message].apply(comp, options);
            }
            // Delete the object if requested
            if (message == 'deleted' && this._toDelete) {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }
        }
    }

}