class Observable extends BlueberryObject {

    private _observable: {} = null;
    private _proxyHandler = {
        get: function (target, name) {
            return name in target ? target[name] : 37;
        }
    };

    public constructor(observable: any, element: DomElement) {
        super();
        this._observable = observable;
        this.object = element;
        this.element = element.element;
        this.id = Blueberry.uniqId();
        let observe
    }

    public get(key: string) {
        for (let i in this._observable) {
            if (i == key) {
                return this._observable[i];
            }
        }
        return null;
    }

    public set(key: string, value: any) {
        if (key in this._observable) {
            // if (Object.getOwnPropertyDescriptor(this._observable, key).set != undefined) {
            //     this._observable[key] = this._observable[key]();
            // } else {
            this._observable[key] = value;
            // }
            let elem = this.element.querySelectorAll(`[observe=${key}]`) as NodeListOf<HTMLElement>;
            for (let i = 0, l = elem.length; i < l; i++) {
                let element = elem[i];
                if (element instanceof HTMLInputElement) {
                    element.value = value;
                } else if (element instanceof HTMLElement) {
                    element.innerText = value;
                }
            }
        }
    }

}