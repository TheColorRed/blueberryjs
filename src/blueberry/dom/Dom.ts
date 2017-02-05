class Dom {

    public element: HTMLElement = null;

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
        Blueberry.upgrade();
        return this;
    }

    public append(html: string) {
        this.element.insertAdjacentHTML('beforeend', html);
        Blueberry.upgrade();
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
        Blueberry.upgrade();
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
                    finalTemp.appendChild(newTemp.firstChild);
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
    public static find(selector: string): DOMObject {
        let item = document.querySelector(selector) as HTMLElement;
        if (item) {
            for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
                if (Blueberry.objects[i].element == item) {
                    return Blueberry.objects[i];
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
                if (Blueberry.objects[j].element == item) {
                    elements.add(Blueberry.objects[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                let de = new DOMObject(item);
                Blueberry.addElement(de);
                elements.add(de)
            }
        }
        return elements;
    }

}