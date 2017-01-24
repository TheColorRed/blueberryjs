class BlueberryObject {

    public id: string = '';
    public element: HTMLElement = null;
    public object: DomElement = null;

    public dom: Dom = null;
    public class: Class = null;
    public style: Style = null;

    protected _toDelete: boolean = false;

    private _props: Properties = new Properties();

    /**
     * Gets all attributes attached to the HTMLElement
     *
     * @readonly
     * @type {Object}
     * @memberOf BlueberryObject
     */
    public get attrs(): Object {
        let attrs = {};
        for (let i = 0, l = this.element.attributes.length; i < l; i++) {
            let name = this.element.attributes[i].name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            attrs[name] = this.element.attributes[i].value;
        }
        return attrs;
    }

    /**
     * Gets properties that have been added to this object
     *
     * @readonly
     * @type {Properties}
     * @memberOf BlueberryObject
     */
    public get props(): Properties {
        return this.object._props;
    }

    /**
     * Gets the parent HTMLElement and converts it to a Blueberry DomElement if it has not yet been converted
     *
     * @readonly
     * @type {DomElement}
     * @memberOf BlueberryObject
     */
    public get parent(): DomElement {
        let pNode = this.element.parentNode;
        for (let i = 0, l = Blueberry.elements.length; i < l; i++) {
            if (Blueberry.elements[i].element == pNode) {
                return Blueberry.elements[i];
            }
        }
        let de = new DomElement(<HTMLElement>pNode);
        Blueberry.addElement(de);
        return de;
    }

    /**
     * Looks up the tree for the closest element with the defined component
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {Component}
     *
     * @memberOf BlueberryObject
     */
    public findClosestComponent<T extends Component>(type: ComponentType<T>): Component {
        let component: Component = null;
        let item = this.element.closest(`[component*=${type.prototype.constructor.name}]`) as HTMLElement;
        Blueberry.elements.forEach(el => {
            if (component != null) { return; }
            el.components.forEach(comp => {
                if (component != null) { return; }
                if (comp instanceof type && comp.element == item) {
                    component = comp;
                }
            });
        });
        return component;
    }

    /**
     * Finds all components that are children of the current Blueberry DomElement
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {Component[]}
     *
     * @memberOf BlueberryObject
     */
    public findChildComponents<T extends Component>(type: ComponentType<T>): Component[] {
        let components: Component[] = [];
        let items = this.element.querySelectorAll('[component]') as NodeListOf<HTMLElement>;
        Blueberry.elements.forEach(el => {
            el.components.forEach(comp => {
                for (let i = 0, l = items.length; i < l; i++) {
                    let item = items[i];
                    if (comp instanceof type && comp.element == item) {
                        components.push(comp);
                    }
                }
            });
        });
        return components;
    }

    /**
     * Finds the first child from a query selector and returns it's DomElement
     *
     * @param {string} selector
     * @returns {DomElement}
     *
     * @memberOf BlueberryObject
     */
    public findChild(selector: string): DomElement {
        let item = this.element.querySelector(selector) as HTMLElement;
        for (let i = 0, l = Blueberry.elements.length; i < l; i++) {
            if (Blueberry.elements[i].element == item) {
                return Blueberry.elements[i];
            }
        }
        let de = new DomElement(item);
        Blueberry.addElement(de);
        return de;
    }

    /**
     * Finds all children from a query selector and returns it's DomElement
     *
     * @param {string} selector
     * @returns {DomElement[]}
     *
     * @memberOf BlueberryObject
     */
    public findChildren(selector: string): DomElement[] {
        let items = this.element.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        let elements: DomElement[] = []
        itemLoop:
        for (let i = 0, l = items.length; i < l; i++) {
            let item = items[i];
            for (let j = 0, len = Blueberry.elements.length; j < len; j++) {
                if (Blueberry.elements[j].element == item) {
                    elements.push(Blueberry.elements[j]);
                    continue itemLoop;
                }
            }
            let de = new DomElement(item);
            Blueberry.addElement(de);
            elements.push(de);
        }
        return elements;
    }

    /**
     * Initializes some internal classes
     *
     *
     * @memberOf BlueberryObject
     */
    public init() {
        this.dom = new Dom(this.element);
        this.class = new Class(this.element);
        this.style = new Style(this.element);
    }

    /**
     * Creates a new Blueberry DomElement and places it in the dom
     *
     * @param {Insert} insert
     * @param {HTMLElement} element
     * @param {(HTMLElement | string)} output
     * @returns {DomElement}
     *
     * @memberOf BlueberryObject
     */
    public instantiate(insert: Insert, element: HTMLElement, output: HTMLElement | string): DomElement {
        let insertType: string = '';
        switch (insert) {
            case Insert.Before: insertType = 'beforebegin'; break;
            case Insert.After: insertType = 'afterend'; break;
            case Insert.Prepend: insertType = 'afterbegin'; break;
            case Insert.Append: insertType = 'beforeend'; break;
        }
        let de: DomElement;
        if (output instanceof HTMLElement) {
            element.insertAdjacentElement(insertType, output);
            de = new DomElement(output);
        } else if (typeof output == 'string') {
            let e = this.createElement(output);
            element.insertAdjacentElement(insertType, e);
            de = new DomElement(e);
        }
        Blueberry.upgrade();
        return de;
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

        c.element = this.element;
        c.object = this.object;
        let compAttr = (c.element.getAttribute('component') || '').split(' ');
        compAttr.push(name);
        c.element.setAttribute('component', compAttr.join(' '));
        c.init();
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

    /**
     * Creates a element reference
     *
     * @protected
     * @param {string} html
     * @returns {HTMLElement}
     *
     * @memberOf BlueberryObject
     */
    protected createElement(html: string): HTMLElement {
        var div = document.createElement('div');
        div.innerHTML = html;
        return <HTMLElement>div.firstChild;
    }



}