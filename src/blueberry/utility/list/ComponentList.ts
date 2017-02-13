class ComponentList extends ObjList<Component> {
    public set(key: string | Object, value?: any): this {
        return this.each(item => item.set(key, value));
    }
    public setProp(key: string | Object, value?: any): this {
        return this.each(item => {
            if (typeof key == 'string' && item[key]) {
                item[key] = value;
            } else if (typeof key == 'object') {
                for (let k in key) {
                    item[k] = key[k];
                }
            }
        });
    }

    public call(method: string, ...args: any[]): this {
        return this.each(item => {
            if (item[method]) {
                item[method].apply(method, args);
            }
        });
    }
}