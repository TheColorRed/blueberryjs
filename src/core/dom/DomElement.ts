class DomElement extends BlueberryObject {

    private _components: Component[] = [];
    private _parent: DomElement = null;

    public get components(): Component[] {
        return this._components;
    }

    public constructor(element: HTMLElement) {
        super();
        this.id = Blueberry.uniqId();
        element.setAttribute('bluberry-element-id', this.id);
        this.element = element;
        this.object = this;
        this.init();
        this.getComponents();
    }

    public sendMessage(message: string, ...options: any[]) {
        this._components.forEach(comp => {
            if (message == 'created') {
                if (comp['_started']) { return; }
                comp['_started'] = true;
                if (typeof comp['observe'] == 'function') {
                    comp.getObservables();
                    comp.getModels();
                }
            }
            if (message == 'deleted') {
                if (!this._toDelete) { return; }
            }
            if (typeof comp[message] == 'function') {
                comp[message].apply(comp, options);
            }
            // Delete the object if requested
            if (message == 'deleted' && this._toDelete) {
                this.element.parentNode.removeChild(this.element);
            }
        });
    }

    private getComponents() {
        let comp = this.element.getAttribute('component');
        if (!comp) {
            comp = this.element.getAttribute('data-component');
        }
        comp = !comp ? '' : comp;
        for (let i = 0, l = this.element.attributes.length; i < l; i++) {
            let attr = this.element.attributes[i];
            if (attr.name.match(/^comp-/)) {
                comp += ' ' + attr.localName.replace(/comp-/, '').replace(/-/g, ' ').capitalizeFirstLetter().replace(/ /g, '');
            }
        }
        let comps = comp.replace(/\s\s+/g, '').trim().split(' ');
        for (let i = 0, l = comps.length; i < l; i++) {
            let name = comps[i];
            if (name.length > 0) {
                let c: Component = new Blueberry.registered[name]();
                c.element = this.element;
                c.object = this;
                c.id = Blueberry.uniqId();
                this.setProperties(c, this.element);
                c.init();
                this._components.push(c);
            }
        }
    }

    private setProperties(component: Component, element: HTMLElement) {
        for (let i = 0, l = element.attributes.length; i < l; i++) {
            let attr = this.element.attributes[i];
            if (attr.name.match(/^comp-/)) {
                let vals = attr.value.split(';');
                vals.forEach(val => {
                    if (val.trim().length == 0) { return; }
                    let keyVal = val.trim().split(':', 2);
                    component[keyVal[0].trim()] = keyVal[1].trim();
                });
            }
        }
    }

    private hasComponents(element: HTMLElement): boolean {
        let has = element.hasAttribute('component');
        if (!has) {
            has = element.hasAttribute('data-component');
        }
        return has;
    }

}