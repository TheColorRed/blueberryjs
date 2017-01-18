class Dom {

    public element: HTMLElement = null;

    public constructor(element: HTMLElement) {
        this.element = element;
    }

    public text(text: string): this {
        this.element.innerHTML = text;
        return this;
    }

    public html(html: string): this {
        this.element.innerHTML = html;
        Blueberry.init();
        return this;
    }

    public content(data: string | HTMLElement | HTMLCollectionOf<HTMLElement>): this {
        if (data instanceof HTMLElement) {
            this.element.innerHTML = data.outerHTML;
        } else if (data instanceof HTMLCollection) {
            while (data.length > 0) {
                this.element.appendChild(data[0]);
            }
        } else if (this.element instanceof HTMLInputElement) {
            this.element.value = data;
        } else if (this.element instanceof HTMLElement) {
            this.element.innerText = data;
        }
        Blueberry.init();
        return this;
    }

    public fromTemplate(template: string, data: any): this {
        if (typeof data == 'object') {
            let finalTemp = document.createElement('div');
            for (let key in data) {
                let newTemp = this.getTemplate(template);
                let items = newTemp.querySelectorAll('*') as NodeListOf<HTMLElement>;
                let value = data[key];
                for (let i = 0, l = items.length; i < l; i++) {
                    let item = items[i];
                    let observed = item.getAttribute('observe');
                    if (observed) {
                        item.innerText = Blueberry.query(observed, value);
                    }
                    for (let a = 0, len = item.attributes.length; a < len; a++) {
                        let attrValue = item.attributes[a].value;
                        let attrName = item.attributes[a].name;
                        const regex = /\{\{(.+?)\}\}/g;
                        let m;
                        let v = attrValue;
                        while ((m = regex.exec(attrValue)) != null) {
                            if (m.index === regex.lastIndex) { regex.lastIndex++; }
                            v = v.replace(`{{${m[1]}}}`, Blueberry.query(m[1], value));
                        }
                        item.setAttribute(attrName, v);
                    }
                }
                finalTemp.appendChild(newTemp);
            }
            this.content(finalTemp.children as HTMLCollectionOf<HTMLElement>);
        }
        return this;
    }

    private getTemplate(template: string): HTMLElement {
        let root = document.createElement('div');
        root.innerHTML = template;
        return <HTMLElement>root.firstChild;
    }

}