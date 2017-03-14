/**
 * The type of insertion
 *
 * @enum {number}
 */
enum Insert {
    Before, After, Append, Prepend, Overwrite
}

class Dom {

    public element: HTMLElement;

    public get value(): string {
        if (this.element instanceof HTMLInputElement) {
            return this.element.value;
        } else {
            return this.element.innerText;
        }
    }

    public constructor(element: HTMLElement) {
        this.element = element;
    }

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
     * Sets the text value for an HTMLElement
     *
     * @param {string} text
     * @returns {this}
     *
     * @memberOf Dom
     */
    public text(text: string): this {
        this.element.innerHTML = text;
        return this;
    }

    /**
     * Sets the html value for an HTMLElement
     *
     * @param {string} html
     * @returns {this}
     *
     * @memberOf Dom
     */
    public html(html: string): this {
        this.element.innerHTML = html;
        // Blueberry.upgrade();
        DOMObject.initElementsWithComponent();
        return this;
    }

    public append(html: string) {
        this.element.insertAdjacentHTML('beforeend', html);
        // Blueberry.upgrade();
        // DOMObject.initElementsWithComponent();
        return this;
    }

    public attr(key: string | Object, value: string): this {
        if (arguments.length == 1 && typeof key == 'object') {
            for (let i in key) {
                this.element.setAttribute(i, key[i]);
            }
        } else if (arguments.length == 2 && typeof key == 'string') {
            this.element.setAttribute(key, value);
        }
        return this;
    }

    /**
     * Sets the content of an HTMLElement. If the element is an input element then the value will be set otherwise the text will be set.
     *
     * @param {(string | HTMLElement | HTMLCollectionOf<HTMLElement>)} data
     * @returns {this}
     *
     * @memberOf Dom
     */
    public content(data: string | HTMLElement | HTMLCollectionOf<HTMLElement>, insertType?: Insert): this {
        insertType = !insertType ? Insert.Overwrite : insertType;
        if (data instanceof HTMLElement) {
            if (insertType == Insert.Overwrite) {
                this.element.innerHTML = data.outerHTML;
            }
        } else if (data instanceof HTMLCollection) {
            if (insertType == Insert.Overwrite) {
                this.element.innerHTML = '';
            }
            while (data.length > 0) {
                this.element.appendChild(data[0]);
            }
        } else if (this.element instanceof HTMLInputElement) {
            this.element.value = data;
        } else if (this.element instanceof HTMLElement) {
            this.element.innerText = data;
        }
        // Blueberry.upgrade();
        // DOMObject.initElementsWithComponent();
        return this;
    }

    /**
     * Sets the content of an element based on a template and data
     *
     * @param {string} templateUrl
     * @param {*} data
     * @returns {this}
     *
     * @memberOf Dom
     */
    public fromTemplate(templateUrl: string, data: any, insertType: Insert): this {
        Ajax.request(templateUrl).success(response => {
            if (typeof data == 'object') {
                let finalTemp = document.createElement('div');
                for (let key in data) {
                    let newTemp = this.getTemplate(<string>response.data);
                    let items = newTemp.querySelectorAll('*') as NodeListOf<HTMLElement>;
                    let value = data[key];
                    for (let i = 0, l = items.length; i < l; i++) {
                        let item = items[i];
                        let observed = item.getAttribute('observe');
                        if (observed) {
                            item.innerText = Blueberry.query(observed, value);
                        }
                        for (let a = 0, len = item.attributes.length; a < len; a++) {
                            let attrValue = item.attributes[a].value;
                            let attrName = item.attributes[a].name;
                            const regex = /\{\{(.+?)\}\}/g;
                            let m;
                            let v = attrValue;
                            while ((m = regex.exec(attrValue)) != null) {
                                if (m.index === regex.lastIndex) { regex.lastIndex++; }
                                v = v.replace(`{{${m[1]}}}`, Blueberry.query(m[1], value));
                            }
                            item.setAttribute(attrName, v);
                        }
                    }
                    if (newTemp.firstChild) {
                        finalTemp.appendChild(newTemp.firstChild);
                    }
                }
                this.content(finalTemp.children as HTMLCollectionOf<HTMLElement>, insertType);
            }
        });
        return this;
    }

    /**
     * Disables an HTMLElement
     *
     * @returns {this}
     *
     * @memberOf Dom
     */
    public disable(): this {
        (<any>this.element).disabled = true;
        return this;
    }

    /**
     * Enables an HTMLElement
     *
     * @returns {this}
     *
     * @memberOf Dom
     */
    public enable(): this {
        (<any>this.element).disabled = false;
        return this;
    }

    /**
     * Creates a wrapper for usage
     *
     * @private
     * @param {string} template
     * @returns {HTMLElement}
     *
     * @memberOf Dom
     */
    private getTemplate(template: string): HTMLElement {
        let root = document.createElement('div');
        root.innerHTML = template;
        return <HTMLElement>root;
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
    public static find(selector: string): DOMObject | null {
        let item = document.querySelector(selector) as HTMLElement;
        if (item) {
            for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
                let obj = Blueberry.objects[i];
                if (obj instanceof DOMObject && obj.element == item) {
                    return obj;
                }
            }
            let de = new DOMObject(item);
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
    public static findAll(selector: string): DOMObjectList {
        let elements = new DOMObjectList();
        let items = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        for (let i = 0, l = items.length; i < l; i++) {
            let item = items[i];
            let found: boolean = false;
            for (let j = 0, len = Blueberry.objects.length; j < len; j++) {
                let obj = Blueberry.objects[i];
                if (obj instanceof DOMObject && obj.element === item) {
                    elements.add(obj);
                    found = true;
                    break;
                }
            }
            // if (!found) {
            //     let dm = new DOMObject(item);
            //     Blueberry.addElement(dm);
            //     elements.add(dm);
            // }
        }
        return elements;
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
    public static findById(id: string): DOMObject | null {
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            if (Blueberry.objects[i].elementId == id) {
                return Blueberry.objects[i];
            }
        }
        return null;
    }

    public static findWithComponent<T extends Component>(query: string, type: ComponentType<T>): T | null {
        let elements = document.querySelectorAll(query) as NodeListOf<HTMLElement>;
        for (let i = 0, l = elements.length; i < l; i++) {
            let element = elements[i];
            for (let e = 0, len = Blueberry.objects.length; e < len; e++) {
                let el = Blueberry.objects[e];
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
    public static findByComponent<T extends Component>(type: ComponentType<T>): DOMObjectList {
        let elements = new DOMObjectList();
        Blueberry.objects.forEach(el => {
            if (el instanceof DOMObject) {
                el.components.forEach(comp => {
                    if (comp instanceof type) {
                        elements.add(el);
                    }
                });
            }
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
        Blueberry.objects.forEach(el => {
            if (el instanceof DOMObject) {
                el.components.forEach(comp => {
                    if (comp instanceof type) {
                        list.add(<T>comp);
                    }
                });
            }
        });
        return list;
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
    public instantiate(insert: Insert, element: HTMLElement, output: HTMLElement | string): DOMObject | null {
        let insertType: string = '';
        switch (insert) {
            case Insert.Before: insertType = 'beforebegin'; break;
            case Insert.After: insertType = 'afterend'; break;
            case Insert.Prepend: insertType = 'afterbegin'; break;
            case Insert.Append: insertType = 'beforeend'; break;
        }
        let de: DOMObject | null = null;
        if (output instanceof HTMLElement) {
            element.insertAdjacentElement(insertType, output);
            de = new DOMObject(output);
        } else if (typeof output == 'string') {
            let e = this.createElement(output);
            element.insertAdjacentElement(insertType, e);
            de = new DOMObject(e);
        }
        // Blueberry.upgrade();
        DOMObject.initElementsWithComponent();
        return de;
    }

    /**
     * Initializes components that have not yet been initialized
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    public static initElementsWithComponent() {
        let e = document.querySelectorAll('[component]') as NodeListOf<HTMLElement>;
        let elen = Blueberry.objects.length;
        loop:
        for (let i = 0, l = e.length; i < l; i++) {
            for (let j = 0; j < elen; j++) {
                let obj = Blueberry.objects[j];
                if (obj instanceof DOMObject && e[i] == obj.element) {
                    continue loop;
                }
            }
            Blueberry.addElement(new DOMObject(e[i]));
        }
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
        let div = document.createElement('div');
        div.innerHTML = html;
        return <HTMLElement>div.firstChild;
    }

}