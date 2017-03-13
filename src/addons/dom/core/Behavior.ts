class Behavior extends Component {

    /**
     * Gets all attributes attached to the HTMLElement
     *
     * @readonly
     * @type {Object}
     * @memberOf BlueberryObject
     */
    public get attrs(): any {
        let attrs = {};
        for (let i = 0, l = this.dom.element.attributes.length; i < l; i++) {
            let name = this.dom.element.attributes[i].name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            attrs[name] = this.dom.element.attributes[i].value;
        }
        return attrs;
    }
}