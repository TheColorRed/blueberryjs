abstract class Component extends Obj {

    public observable: Observable;
    public unique: boolean = true;
    public templates: Object = {};

    private _started: boolean = false;
    private _ready: boolean = false;

    /**
     * Sets a value for an observable
     *
     * @param {(string | Object)} key
     * @param {*} [value]
     * @returns {this}
     *
     * @memberOf Component
     */
    public set(key: string | Object, value?: any): this {
        this.observable.set(key, value);
        return this;
    }

    /**
     * Gets a value for an observable
     *
     * @param {string} key
     * @returns
     *
     * @memberOf Component
     */
    public get(key: string) {
        return this.observable.get(key);
    }

    public prop(data: Object): this {
        // this = (<any>Object).assign(this, data);
        // let item = obj ? obj : this;
        for (let key in data) {
            if (this[key]) {
                let setting = (<any>Object).assign(this[key], data[key]);
                this[key] = setting;
            }
        }
        return this;
    }

    public setTemplates() {
        this.templates = this['template']();
    }

    /**
     * Gets all the observables in the current element and children
     *
     *
     * @memberOf Component
     */
    public getObservables() {
        this.observable = new Observable(this, this['observe'](), this.object);
        let observables = this.element.querySelectorAll('[observe]') as NodeListOf<HTMLElement>;
        for (let i = 0, l = observables.length; i < l; i++) {
            let element = observables[i];
            let observeKey = element.getAttribute('observe');
            if (!observeKey) { continue; }
            let observeVal = this.observable.get(observeKey);
            this.observable.set(observeKey, observeVal);
        }
        if (this.element.hasAttribute('observe')) {
            let observeKey = this.element.getAttribute('observe');
            if (!observeKey) { return; }
            let observeVal = this.observable.get(observeKey);
            this.observable.set(observeKey, observeVal);
        }
        this['_init'] = true;
    }

    /**
     * Gets all the models
     *
     *
     * @memberOf Component
     */
    public getModels() {
        let models = this.element.querySelectorAll('[model]') as NodeListOf<HTMLElement>;
        for (let i = 0, l = models.length; i < l; i++) {
            let element = models[i];
            let observeKey = element.getAttribute('model');
            if (!observeKey) { continue; }
            let observeVal = this.observable.get(observeKey);
            if (element instanceof HTMLInputElement) {
                element.addEventListener('input', e => {
                    this.observable.set(observeKey, (<HTMLInputElement>e.currentTarget).value);
                });
                element.value = (typeof observeVal == 'function' ? observeVal() : observeVal) || '';
            }
        }
    }

}