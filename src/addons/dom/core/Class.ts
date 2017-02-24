class Class extends Dom {

    /**
     * Checks if the class exists on the element
     *
     * @param {string} className
     * @returns {boolean}
     *
     * @memberOf Class
     */
    public has(className: string): boolean {
        let classes = className.split(' ');
        for (let i = 0, l = classes.length; i < l; i++) {
            if (this.element.classList.contains(classes[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds one or more classes to an element
     *
     * @param {string} className
     *
     * @memberOf Class
     */
    public add(className: string) {
        className.split(' ').forEach(c => {
            this.element.classList.add(c);
        });
    }

    /**
     * Removes one or more classes from an element
     *
     * @param {string} className
     *
     * @memberOf Class
     */
    public remove(className: string) {
        className.split(' ').forEach(c => {
            this.element.classList.remove(c);
        });
    }

    /**
     * Toggles one or more class on/off on an element
     *
     * @param {string} className
     *
     * @memberOf Class
     */
    public toggle(className: string) {
        className.split(' ').forEach(c => {
            this.element.classList.toggle(c);
        });
    }

}