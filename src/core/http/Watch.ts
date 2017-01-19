class Watch {
    private _items: Ajax[] = [];
    private _done: (response: AjaxResponse[]) => void;
    private _watcher = null;

    public static all(...toWatch: Ajax[]): Watch {
        let all = new Watch();
        all._items = toWatch;
        all._watcher = setInterval(all.testStatus.bind(all), 100);
        return all;
    }

    private testStatus() {
        let responses: AjaxResponse[] = [];
        for (let i = 0, l = this._items.length; i < l; i++) {
            if (!this._items[i].done) {
                return false;
            }
            responses.push(this._items[i].response);
        }
        clearInterval(this._watcher);
        this._done(responses);
    }

    public done(callback: (responses: AjaxResponse[]) => void): this {
        this._done = callback;
        return this;
    }
}