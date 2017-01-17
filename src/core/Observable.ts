class Observable extends BlueberryObject {

    private _observable: {} = null;
    private _component: Component;

    public constructor(component: Component, observable: any, element: DomElement) {
        super();
        this._component = component;
        this._observable = observable;
        this.object = element;
        this.element = element.element;
        this.id = Blueberry.uniqId();
    }

    public get(key: string) {
        for (let i in this._observable) {
            if (i == key) {
                return this._observable[i];
            }
        }
        return null;
    }

    public set(key: string | Object, value: any) {
        if (typeof key == 'string') {
            this.setItem(key, value);
        } else if (typeof key == 'object') {
            for (let i in key) {
                this.setItem(i, key[i]);
            }
        }
    }

    private setItem(key: string, value: any) {
        if (this._observable && key in this._observable) {
            let old = copy(this._observable);
            this._observable[key] = value;
            for (let k in this._observable) {
                if (this._observable[k] != old[k]) {
                    if (typeof this._component['change'] == 'function') {
                        this._component['change'](k, this._observable[k], old[k]);
                    }
                    if (this.element.hasAttribute('observe') && this.element.getAttribute('observe') == k) {
                        this.setVal(this.element, k);
                    }
                    let elem = this.element.querySelectorAll(`[observe=${k}]`) as NodeListOf<HTMLElement>;
                    for (let i = 0, l = elem.length; i < l; i++) {
                        this.setVal(elem[i], k);
                    }
                }
            }
        }
    }

    private setVal(element, key) {
        if (element instanceof HTMLInputElement) {
            element.value = this._observable[key];
        } else if (element instanceof HTMLElement) {
            element.innerText = this._observable[key];
        }
    }

}