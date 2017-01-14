class BlueberryObject {

    public id: string = '';
    public element: HTMLElement = null;
    public object: DomElement = null;

    public dom: Dom = null;
    public class: Class = null;
    public style: Style = null;

    protected _toDelete: boolean = false;

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

    protected createElement(html: string): HTMLElement {
        var div = document.createElement('div');
        div.innerHTML = html;
        return <HTMLElement>div.firstChild;
    }

}