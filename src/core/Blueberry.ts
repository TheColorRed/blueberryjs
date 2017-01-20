class Blueberry {

    private static _elements: DomElement[] = [];
    private static _observable: Observable[] = [];

    private static _registeredComponents: Component[] = [];

    public static get registered(): Component[] {
        return this._registeredComponents;
    }

    public static get elements(): DomElement[] {
        return this._elements;
    }

    public static register(item, value): Blueberry {
        if (arguments.length == 1 && item.prototype instanceof Component) {
            this._registeredComponents[(<any>item).name] = item;
            window[item.name] = item;
        } else if (arguments.length == 2 && typeof item == 'string') {
            window[item] = new value();
        }
        return this;
    }

    public static tick() {
        // Start Events
        Blueberry.created();

        // Update Events
        Blueberry.update();
        Blueberry.lateUpdate();

        Blueberry.deleted();

        requestAnimationFrame(Blueberry.tick);
    }

    public static init() {
        this.findAllComponents();
        this.createClickHandlers();
    }

    public static addElement(domElement: DomElement) {
        this._elements.push(domElement);
        let attrs = domElement.attrs;
        for (let key in attrs) {
            domElement.props.set(key, attrs[key]);
        }
    }

    public static uniqId(length: number = 6): string {
        return (Math.random().toString(36) + Math.random().toString(36)).substr(2, length);
    }

    public static query(path: string, obj = null) {
        let previous = null;
        obj = !obj ? this : obj;
        for (let i = 0, p = path.split(/[\[\]\.]/), len = p.length; i < len; i++) {
            if (p[i] == '') { continue; }
            let item = p[i];//.match(/[0-9]+/) ? path[i] : path[i];
            obj = obj[item];
            previous = obj;
        }
        return obj;
    }

    public static find(selector: string): DomElement {
        let item = document.querySelector(selector) as HTMLElement;
        for (let i = 0, l = Blueberry.elements.length; i < l; i++) {
            if (Blueberry.elements[i].element == item) {
                return Blueberry.elements[i];
            }
        }
        let de = new DomElement(item);
        Blueberry.addElement(de);
        return de;
    }

    public static findAll(selector: string): DomElement[] {
        let elements: DomElement[] = [];
        let items = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        for (let i = 0, l = items.length; i < l; i++) {
            let item = items[i];
            let found: boolean = false;
            for (let j = 0, len = Blueberry.elements.length; j < len; j++) {
                if (Blueberry.elements[j].element == item) {
                    elements.push(Blueberry.elements[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                let de = new DomElement(item);
                Blueberry.addElement(de);
                elements.push(de)
            }
        }
        return elements;
    }

    public static findWithComponent<T extends Component>(type: ComponentType<T>): DomElement[] {
        let elements: DomElement[] = [];
        this._elements.forEach(el => {
            el.components.forEach(comp => {
                if (comp instanceof type) {
                    elements.push(el);
                }
            });
        });
        return elements;
    }

    public static findComponents<T extends Component>(type: ComponentType<T>): T[] {
        let components: T[] = [];
        this.elements.forEach(el => {
            el.components.forEach(comp => {
                if (comp instanceof type) {
                    components.push(<T>comp);
                }
            });
        });
        return components;
    }

    private static findAllComponents() {
        let e = document.querySelectorAll('[component], [data-component]') as NodeListOf<HTMLElement>;
        let elen = this._elements.length;
        loop:
        for (let i = 0, l = e.length; i < l; i++) {
            for (let j = 0; j < elen; j++) {
                if (e[i] == this._elements[j].element) {
                    continue loop;
                }
            }
            this.addElement(new DomElement(e[i]));
        }
        let nodesSnapshot = document.evaluate('//*/@*[starts-with(name(), "comp-")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let attr: Attr;
        for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
            attr = <Attr>nodesSnapshot.snapshotItem(i);
            this.addElement(new DomElement(<HTMLElement>attr.ownerElement));
        }
    }

    private static createClickHandlers() {
        this._elements.forEach(element => {
            element.element.onclick = function (e) {
                e.preventDefault();
                element.components.forEach(component => {
                    if (typeof component['click'] == 'function') {
                        component['click'].bind(component).call(component, e);
                    }
                });
            };
        });
    }

    private static created() {
        this._elements.forEach(element => {
            element.sendMessage('created');
        });
    }

    private static deleted() {
        let i = this._elements.length;
        while (i--) {
            let element = this._elements[i];
            element.sendMessage('deleted');
            if (element['_toDelete']) {
                this._elements.splice(i, 1);
            }
        }
    }

    private static update() {
        this._elements.forEach(element => {
            element.sendMessage('update');
        });
    }

    private static lateUpdate() {
        this._elements.forEach(element => {
            element.sendMessage('lateUpdate');
        });
    }

}