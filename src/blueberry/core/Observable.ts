class Observable extends Obj {

    private _observable: {} = {};
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
        if (element instanceof HTMLInputElement) {
            element.value = this._observable[key];
        } else if (element instanceof HTMLElement) {
            element.innerText = this._observable[key];
        } else if (element instanceof DOMObject) {
            // If the observable key is an array
            if (this._observable[key] instanceof Array) {
                let finalTemplates = this.getFinalTemplates(element, key);
                element.dom.html(finalTemplates.join(''))
            } else {
                element.dom.content(this._observable[key]);
            }
        }
    }

    private getFinalTemplates(element, key): string[] {
        let finalTemplates: string[] = [];
        // If the component has a template lets use it
        if (this._component.templates && this._component.templates[key]) {
            // Set the base template so we can reuse it
            let rootTemplate: string = this._component.templates[key];
            // Find the replaceable items in the template
            let items = Blueberry.findTemplateItems(rootTemplate);
            // Loop over each observable item
            this._observable[key].forEach((o, k, v) => {
                // Create a duplicate template from the root template for the current observable item
                let template = rootTemplate;
                // Replace each item in the template
                items.forEach(item => {
                    // If the value is 'value' use the value of the array
                    if (item.value == 'value') {
                        template = template.replace(new RegExp(item.placeholder, 'g'), o);
                    }
                    // If the value is 'key' use the key from the array
                    else if (item.value == 'key') {
                        template = template.replace(new RegExp(item.placeholder, 'g'), k);
                    }
                    // Otherwise use what was defined in the teplate
                    else {
                        template = template.replace(new RegExp(item.placeholder, 'g'), this.get(`${key}[${k}].${item.value}`));
                    }
                });
                // Push the template to the output template array
                finalTemplates.push(template);
            });
        }
        // The component doesn't have a template
        // Just push the item
        else {
            this._observable[key].forEach(item => {
                if (element instanceof DOMObject) {
                    finalTemplates.push(item);
                }
            });
        }
        return finalTemplates;
    }

}