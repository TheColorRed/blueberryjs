class Observable extends Obj {

    private _observable: {} = {};
    private _component: Component;
    private _init: boolean = false;

    public constructor(component: Component, observable: any, element: any) {
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
    public set(key: string | Object | null, value: any) {
        if (typeof key == 'string') {
            this.setItem(key, value);
        } else if (typeof key == 'object' && key) {
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
            let old = Obj.clone(this._observable);
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
        if (this.object.onObserve) {
            this.object.onObserve(this._observable, element, this._component, key);
        }
        // if (element instanceof HTMLInputElement) {
        //     element.value = this._observable[key];
        // } else if (element instanceof HTMLElement) {
        //     element.innerText = this._observable[key];
        // } else if (element instanceof DOMObject) {
        //     // If the observable key is an array
        //     if (this._observable[key] instanceof Array) {
        //         let finalTemplates = this.getFinalTemplates(element, key);
        //         element.dom.html(finalTemplates.join(''))
        //     } else {
        //         element.dom.content(this._observable[key]);
        //     }
        // }
    }

}