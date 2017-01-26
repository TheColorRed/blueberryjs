abstract class BlueberryObjectList<T extends BlueberryObject> extends BlueberryList<T>{
    public setStyle(key: string | {}, value: string): this {
        return this.each(item => item.style.set(key, value));
    }

    public disable(): this {
        return this.each(item => item.dom.disable());
    }

    public enable(): this {
        return this.each(item => item.dom.enable());
    }

    public content(data: string | HTMLElement | HTMLCollectionOf<HTMLElement>, insertType?: Insert): this {
        return this.each(item => item.dom.content(data, insertType));
    }

    public html(html: string): this {
        return this.each(item => item.dom.html(html));
    }

    public text(html: string): this {
        return this.each(item => item.dom.text(html));
    }

    public setClass(className: string): this {
        return this.each(item => item.class.add(className));
    }

    public removeClass(className: string): this {
        return this.each(item => item.class.remove(className));
    }

    public toggleClass(className: string): this {
        return this.each(item => item.class.toggle(className));
    }
}