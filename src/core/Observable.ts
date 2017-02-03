class Observable extends BlueberryObject {

    private _observable: {} = null;
    private _component: Component;
    private _init: boolean = false;

    public constructor(component: Component, observable: any, element: DOMObject) {
        super();
        if (typeof observable == 'function') {
            observable = observable();
        }
        this._component = component;
        this._observable = observable;
        this.object = element;
        this.element = element.element;
        this.id = Blueberry.uniqId();
    }

    /**
     * Gets a value from the observable
     *
     * @param {string} key
     * @returns
     *
     * @memberOf Observable
     */
    public get(key: string) {
        return Blueberry.query(key, this._observable);
        // for (let i in this._observable) {
        //     if (i == key) {
        //         return this._observable[i];
        //     }
        // }
        // return null;
    }

    /**
     * Sets and a value in the observable and updates the dom
     *
     * @param {(string | Object)} key
     * @param {*} value
     *
     * @memberOf Observable
     */
    public set(key: string | Object, value: any) {
        if (typeof key == 'string') {
            this.setItem(key, value);
        } else if (typeof key == 'object') {
            for (let i in key) {
                this.setItem(i, key[i]);
            }
        }
    }

    /**
     * Apply the update to the observable and update the dom
     *
     * @private
     * @param {string} key
     * @param {*} value
     *
     * @memberOf Observable
     */
    private setItem(key: string, value: any) {
        if (this._observable && key in this._observable) {
            let old = copy(this._observable);
            this._observable[key] = value;
            for (let k in this._observable) {
                if (this._observable[k] != old[k] || !this._init) {
                    if (typeof this._component['change'] == 'function') {
                        this._component['change'](k, this._observable[k], old[k]);
                    }
                    if (this.element.hasAttribute('observe') && this.element.getAttribute('observe') == k) {
                        this.setVal(this.object, k);
                    }
                    let elem = this.element.querySelectorAll(`[observe=${k}]`) as NodeListOf<HTMLElement>;
                    for (let i = 0, l = elem.length; i < l; i++) {
                        this.setVal(elem[i], k);
                    }
                }
            }
        }
    }

    /**
     * Sets the dom value or text
     *
     * @private
     * @param {any} element
     * @param {any} key
     *
     * @memberOf Observable
     */
    private setVal(element, key) {
        if (element instanceof HTMLInputElement) {
            element.value = this._observable[key];
        } else if (element instanceof HTMLElement) {
            element.innerText = this._observable[key];
        } else if (element instanceof DOMObject) {
            if (this._observable[key] instanceof Array) {
                let vals = [];
                if (this._component.templates && this._component.templates[key]) {
                    let rootTemplate: string = this._component.templates[key];
                    let items = Blueberry.findTemplateItems(rootTemplate);
                    this._observable[key].forEach((o, k, v) => {
                        let template = rootTemplate;
                        items.forEach(item => {
                            if (item.value == 'value') {
                                template = template.replace(new RegExp(item.placeholder, 'g'), v);
                            } else if (item.value == 'key') {
                                template = template.replace(new RegExp(item.placeholder, 'g'), k);
                            } else {
                                template = template.replace(new RegExp(item.placeholder, 'g'), this.get(`names[${k}].${item.value}`));
                            }
                        });
                        vals.push(template)
                    });
                } else {
                    this._observable[key].forEach(item => {
                        if (element instanceof DOMObject) {
                            vals.push(`<span>${item}</span>`);
                        }
                    });
                }
                element.dom.html(vals.join(''))
            } else {
            }
        }
    }

}