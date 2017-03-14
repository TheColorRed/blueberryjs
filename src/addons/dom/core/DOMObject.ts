interface Component {
    dom: Dom,
    class: Class,
    style: Style,
    parent: any
}
class DOMObject extends Addon {

    // private static _objects: DOMObject[] = [];

    private _parent: DOMObject;

    public dom: Dom;
    public class: Class;
    public style: Style;

    public get components(): Component[] {
        return this._components;
    }

    // public static get objects(): DOMObject[] {
    //     return this._objects;
    // }

    public constructor(element: HTMLElement) {
        super();
        this.id = Blueberry.uniqId();
        element.setAttribute('bluberry-element-id', this.id);
        this.element = element;
        this.object = this;
        this.dom = new Dom(element);
        this.class = new Class(element);
        this.style = new Style(element);
        // this.init();
        this.getComponents();
    }

    // public static init() {
    //     this.initElementsWithComponent();
    // }


    /**
     * Initializes components that have not yet been initialized
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    public static initElementsWithComponent() {
        let e = document.querySelectorAll('[component]') as NodeListOf<HTMLElement>;
        let elen = Blueberry.objects.length;
        loop:
        for (let i = 0, l = e.length; i < l; i++) {
            for (let j = 0; j < elen; j++) {
                let obj = Blueberry.objects[j];
                if (obj instanceof DOMObject && e[i] == obj.element) {
                    continue loop;
                }
            }
            Blueberry.addElement(new DOMObject(e[i]));
        }
    }

    /**
     * Gets the elements attached component from the dom
     *
     * @private
     *
     * @memberOf DomElement
     */
    private getComponents() {
        let comp = this.element.getAttribute('component');
        if (!comp) {
            comp = this.element.getAttribute('data-component');
        }
        comp = !comp ? '' : comp;
        for (let i = 0, l = this.element.attributes.length; i < l; i++) {
            let attr = this.element.attributes[i];
            if (attr.localName && attr.name.match(/^comp-/)) {
                comp += ' ' + attr.localName.replace(/comp-/, '').replace(/-/g, ' ').capitalizeFirstLetter().replace(/ /g, '');
            }
        }
        let comps = comp.replace(/\s\s+/g, '').trim().split(' ');
        for (let i = 0, l = comps.length; i < l; i++) {
            let name = comps[i];
            if (name.length > 0) {
                try {
                    let c: Component = new Blueberry.registered[name]();
                    c.element = this.element;
                    c.object = this;
                    c.id = Blueberry.uniqId();
                    this.setProperties(c, this.element);
                    c.dom = this.dom;
                    c.class = this.class;
                    c.style = this.style;
                    c.parent = this.parent;
                    // c.init();
                    this._components.push(c);
                } catch (e) {
                    console.warn(`Could not find Component '${name}'. Did you forget to import it?`);
                }
            }
        }
    }

    /**
     * Sets properties on the element
     *
     * @private
     * @param {Component} component
     * @param {HTMLElement} element
     *
     * @memberOf DomElement
     */
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

    /**
     * Checks to see if the dom element has a component attribute
     *
     * @private
     * @param {HTMLElement} element
     * @returns {boolean}
     *
     * @memberOf DomElement
     */
    private hasComponents(element: HTMLElement): boolean {
        let has = element.hasAttribute('component');
        if (!has) {
            has = element.hasAttribute('data-component');
        }
        return has;
    }

    /**
     * Gets the parent HTMLElement and converts it to a Blueberry DomElement if it has not yet been converted
     *
     * @readonly
     * @type {DomElement}
     * @memberOf BlueberryObject
     */
    public get parent(): DOMObject {
        let pNode = this.element.parentNode;
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            let obj = Blueberry.objects[i];
            if (obj instanceof DOMObject && obj.element == pNode) {
                return obj;
            }
        }
        let de = new DOMObject(<HTMLElement>pNode);
        Blueberry.addElement(de);
        return de;
    }

    /**
     * Looks up the tree for the closest element with the defined component
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {Component}
     *
     * @memberOf BlueberryObject
     */
    public findClosestComponent<T extends Component>(type: ComponentType<T>): Component | null {
        let component: Component | null = null;
        let item = this.element.closest(`[component*=${type.prototype.constructor.name}]`) as HTMLElement;
        Blueberry.objects.forEach(el => {
            if (component != null) { return; }
            if (el instanceof DOMObject) {
                el.components.forEach(comp => {
                    if (component != null) { return; }
                    if (comp instanceof type && comp.element == item) {
                        component = comp;
                    }
                });
            }
        });
        return component;
    }

    /**
     * Finds all components that are children of the current Blueberry DomElement
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {Component[]}
     *
     * @memberOf BlueberryObject
     */
    public findChildComponents<T extends Component>(type: ComponentType<T>): ComponentList {
        let list = new ComponentList();
        let items = this.element.querySelectorAll('[component]') as NodeListOf<HTMLElement>;
        Blueberry.objects.forEach(el => {
            if (el instanceof DOMObject) {
                el.components.forEach(comp => {
                    for (let i = 0, l = items.length; i < l; i++) {
                        let item = items[i];
                        if (comp instanceof type && comp.element == item) {
                            list.add(comp);
                        }
                    }
                });
            }
        });
        return list;
    }

    /**
     * Finds the first child from a query selector and returns it's DomElement
     *
     * @param {string} selector
     * @returns {DomElement}
     *
     * @memberOf BlueberryObject
     */
    public findChild(selector: string): DOMObject {
        let item = this.element.querySelector(selector) as HTMLElement;
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            let obj = Blueberry.objects[i];
            if (obj instanceof DOMObject && obj.element == item) {
                return obj;
            }
        }
        let de = new DOMObject(item);
        Blueberry.addElement(de);
        return de;
    }

    /**
     * Finds all children from a query selector and returns it's DomElement
     *
     * @param {string} selector
     * @returns {DomElement[]}
     *
     * @memberOf BlueberryObject
     */
    public findChildren(selector: string): DOMObjectList {
        let items = this.element.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        let elements = new DOMObjectList();
        itemLoop:
        for (let i = 0, l = items.length; i < l; i++) {
            let item = items[i];
            for (let j = 0, len = Blueberry.objects.length; j < len; j++) {
                let obj = Blueberry.objects[j];
                if (obj instanceof DOMObject && obj.element == item) {
                    elements.add(obj);
                    continue itemLoop;
                }
            }
            let de = new DOMObject(item);
            Blueberry.addElement(de);
            elements.add(de);
        }
        return elements;
    }

    public static toObject(element: HTMLElement): DOMObject {
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            if (Blueberry.objects[i].element == element) {
                return Blueberry.objects[i];
            }
        }
        let domObject = new DOMObject(element);
        Blueberry.addElement(domObject);
        return domObject;
    }

    public onObserve(observable: Object, element: HTMLInputElement | HTMLElement | DOMObject, component: Component, key) {
        if (element instanceof HTMLInputElement) {
            element.value = observable[key];
        } else if (element instanceof HTMLElement) {
            element.innerText = observable[key];
        } else if (element instanceof DOMObject) {
            // If the observable key is an array
            if (observable[key] instanceof Array) {
                let finalTemplates = this.getFinalTemplates(element, component, observable, key);
                element.dom.html(finalTemplates.join(''))
            } else {
                element.dom.content(observable[key]);
            }
        }
    }

    private getFinalTemplates(element, component: Component, observable, key): string[] {
        let finalTemplates: string[] = [];
        // If the component has a template lets use it
        if (component.templates && component.templates[key]) {
            // Set the base template so we can reuse it
            let rootTemplate: string = component.templates[key];
            // Find the replaceable items in the template
            let items = Blueberry.findTemplateItems(rootTemplate);
            // Loop over each observable item
            observable[key].forEach((o, k, v) => {
                // Create a duplicate template from the root template for the current observable item
                let template = rootTemplate;
                // Replace each item in the template
                items.forEach(item => {
                    // If the value is 'value' use the value of the array
                    if (item.value == 'value') {
                        template = template.replace(new RegExp(item.placeholder, 'g'), o);
                    }
                    // If the value is 'key' use the key from the array
                    else if (item.value == 'key') {
                        template = template.replace(new RegExp(item.placeholder, 'g'), k);
                    }
                    // Otherwise use what was defined in the teplate
                    else {
                        template = template.replace(new RegExp(item.placeholder, 'g'), component.get(`${key}[${k}].${item.value}`));
                    }
                });
                // Push the template to the output template array
                finalTemplates.push(template);
            });
        }
        // The component doesn't have a template
        // Just push the item
        else {
            observable[key].forEach(item => {
                if (element instanceof DOMObject) {
                    finalTemplates.push(item);
                }
            });
        }
        return finalTemplates;
    }
}