abstract class Component extends Obj {

    public observable: Observable = null;
    public unique: boolean = true;
    public templates: Object = {};

    // public abstract click(event?: Event): void;
    // public abstract created(): void;
    // public abstract update(): void;
    // public abstract deleted(): void;

    private _started: boolean = false;

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
            let observeVal = this.observable.get(observeKey);
            this.observable.set(observeKey, observeVal);
        }
        if (this.element.hasAttribute('observe')) {
            let observeKey = this.element.getAttribute('observe');
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