class Exp {
    /**
     * All items must match the first item.
     *
     * @static
     * @param {*} match
     * @param {...any[]} against
     * @returns {boolean}
     *
     * @memberOf Exp
     */
    public static all(match: any, ...against: any[]): boolean {
        for (let i = 0, l = against.length; i < l; i++) {
            if (match != against[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * None of the items should match the first item.
     *
     * @static
     * @param {*} match
     * @param {...any[]} against
     * @returns {boolean}
     *
     * @memberOf Exp
     */
    public static none(match: any, ...against: any[]): boolean {
        return against.indexOf(match) == -1;
    }

    /**
     * One of the items should match the first item
     *
     * @static
     * @param {*} match
     * @param {...any[]} against
     * @returns {boolean}
     *
     * @memberOf Exp
     */
    public static one(match: any, ...against: any[]): boolean {
        return against.indexOf(match) > -1;
    }

}