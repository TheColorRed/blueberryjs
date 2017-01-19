class BlueberryObject {

    public id: string = '';
    public element: HTMLElement = null;
    public object: DomElement = null;

    public dom: Dom = null;
    public class: Class = null;
    public style: Style = null;

    protected _toDelete: boolean = false;

    public get attrs(): Object {
        let attrs = {};
        for (let i = 0, l = this.element.attributes.length; i < l; i++) {
            attrs[this.element.attributes[i].name] = this.element.attributes[i].value;
        }
        return attrs;
    }

    public get parent(): DomElement {
        let pNode = this.element.parentNode;
        for (let i = 0, l = Blueberry.elements.length; i < l; i++) {
            if (Blueberry.elements[i].element == pNode) {
                return Blueberry.elements[i];
            }
        }
        let de = new DomElement(<HTMLElement>pNode);
        Blueberry.addElement(de);
        return de;
    }

    public init() {
        this.dom = new Dom(this.element);
        this.class = new Class(this.element);
        this.style = new Style(this.element);
    }

    public instantiate(insert: Insert, element: HTMLElement, output: HTMLElement | string): DomElement {
        let insertType: string = '';
        switch (insert) {
            case Insert.Before: insertType = 'beforebegin'; break;
            case Insert.After: insertType = 'afterend'; break;
            case Insert.Prepend: insertType = 'afterbegin'; break;
            case Insert.Append: insertType = 'beforeend'; break;
        }
        let de: DomElement;
        if (output instanceof HTMLElement) {
            element.insertAdjacentElement(insertType, output);
            de = new DomElement(output);
        } else if (typeof output == 'string') {
            let e = this.createElement(output);
            element.insertAdjacentElement(insertType, e);
            de = new DomElement(e);
        }
        Blueberry.init();
        return de;
    }

    public destroy(delay: number = 0): void {
        setTimeout(() => {
            this.object._toDelete = true;
        }, delay * 1000);
    }

    public addComponent<T extends Component>(type: ComponentType<T>): T {
        let c = new type() as T;
        let name = (<any>c).constructor.name;
        for (let i = 0, l = this.object.components.length; i < l; i++) {
            let comp = this.object.components[i];
            if (name == (<any>comp).constructor.name && comp.unique) {
                return null;
            }
        }

        c.element = this.element;
        c.object = this.object;
        let compAttr = c.element.getAttribute('component').split(' ');
        compAttr.push(name);
        c.element.setAttribute('component', compAttr.join(' '));
        c.init();
        this.object['_components'].push(c);
        return c;
    }

    protected createElement(html: string): HTMLElement {
        var div = document.createElement('div');
        div.innerHTML = html;
        return <HTMLElement>div.firstChild;
    }



}