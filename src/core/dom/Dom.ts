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

    public content(data: string): this {
        if (this.element instanceof HTMLInputElement) {
            this.element.value = data;
        } else if (this.element instanceof HTMLElement) {
            this.element.innerText = data;
        }
        return this;
    }

}