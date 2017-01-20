abstract class Component extends BlueberryObject {

    public observable: Observable = null;
    public unique: boolean = true;
    private _started: boolean = false;

    public abstract click(event?: Event): void;
    public abstract created(): void;
    public abstract update(): void;
    public abstract deleted(): void;

    public set(key: string | Object, value?: any): this {
        this.observable.set(key, value);
        return this;
    }

    public get(key: string) {
        return this.observable.get(key);
    }

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