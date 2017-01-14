class Style extends Dom {

    public set(key: string | {}, value: string): this {
        if (typeof key == 'string') {
            this.element.style[key] = value;
        } else {
            for (let i in key) {
                this.element.style[i] = key[i];
            }
        }
        return this;
    }

}