class Style extends Dom {

    /**
     * Sets a style on the HTMLElement
     *
     * @param {(string | {})} key
     * @param {string} value
     * @returns {this}
     *
     * @memberOf Style
     */
    public set(key: string | Object, value?: string): this {
        if (typeof key == 'string') {
            this.element.style[key] = value;
        } else {
            for (let i in key) {
                this.element.style[i] = key[i];
            }
        }
        return this;
    }

    /**
     * Removes a style from an HTMLElement
     *
     * @param {(string | string[])} key
     * @returns {this}
     *
     * @memberOf Style
     */
    public remove(key: string | string[]): this {
        if (typeof key == 'string') {
            delete this.element.style[key];
        } else {
            for (let i in key) {
                delete this.element.style[i];
            }
        }
        return this;
    }

}