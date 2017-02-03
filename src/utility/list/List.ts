class List<T> {

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

    public clear(): void {
        this._items = [];
    }

    public contains(item: T): boolean {
        for (let i = 0, l = this._items.length; i < l; i++) {
            if (this._items[i] == item) {
                return true;
            }
        }
        return false;
    }

    public indexOf(item: T): number {
        for (let i = 0, l = this._items.length; i < l; i++) {
            if (this._items[i] == item) {
                return i;
            }
        }
        return -1;
    }

    public lastIndexOf(item: T): number {
        let i = this._items.length;
        while (i--) {
            if (this._items[i] == item) {
                return i;
            }
        }
        return -1;
    }

    public insert(index: number, item: T): this {
        this._items.splice(index, 0, item);
        return this;
    }

    public toArray() {
        return this._items;
    }

}