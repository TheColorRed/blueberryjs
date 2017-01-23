class Properties {

    private _props: Property[] = [];

    /**
     * Sets one or more properties. If the property already exists it will be updated, otherwise it will be added.
     *
     * @param {(string | Property | Property[])} key
     * @param {*} [value]
     *
     * @memberOf Properties
     */
    public set(property: Property | Property[]): this {
        // If the key is an array of Property reset the array
        if (Array.isArray(property)) {
            this._props = property;
            return this;
        }
        // Update property if it exists
        let i = this._props.length;
        while (i--) {
            if (this._props[i].key == property.key) {
                this._props.splice(i, 1);
                this._props.push(property);
                return this;
            }
        }
        // Add the property if we get this far
        this._props.push(property);
        return this;
    }

    public add(key: string | Property, val?: any): this {
        // Check if the property exists if it does don't add it
        for (let i = 0, l = this._props.length; i < l; i++) {
            if ((typeof key == 'string' && this._props[i].key == key) || (key instanceof Property && this._props[i].key == key.key)) {
                return this;
            }
        }
        // If th property doesn't exit add it
        let prop: Property;
        if (typeof key == 'string' && arguments.length == 2) {
            prop = new Property(key, val);
        } else if (key instanceof Property) {
            prop = key;
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