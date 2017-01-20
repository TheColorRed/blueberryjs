class Properties {

    private _props: Property[] = [];

    public set(key: string, val: any): this {
        let prop: Property;
        for (let i = 0, l = this._props.length; i < l; i++) {
            if (this._props[i].key == key) {
                prop = this._props[i];
            }
        }
        if (!prop) {
            prop = new Property(key, val);
        }
        this._props.push(prop);
        return this;
    }

    public get(key: string): any {
        for (let i = 0, l = this._props.length; i < l; i++) {
            if (this._props[i].key == key) {
                return this._props[i].val;
            }
        }
        return null;
    }

}

class Property {
    private _key: string = '';
    private _val: any = null;

    public get key(): string {
        return this._key;
    }

    public get val(): any {
        return this._val;
    }

    public constructor(key, val) {
        this._key = key;
        this._val = val;
    }
}