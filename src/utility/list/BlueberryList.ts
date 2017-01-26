abstract class BlueberryList<T> {

    private _items: T[] = [];

    public get list(): T[] {
        return this._items;
    }

    public add(item: T): this {
        this._items.push(item);
        return this;
    }

    public remove(item: T): this {
        this._items.splice(this._items.indexOf(item), 1);
        return this;
    }

    public each(callback: (item: T) => void): this {
        this._items.forEach(item => callback(item));
        return this;
    }

}