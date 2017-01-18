abstract class Component extends BlueberryObject {

    public observable: Observable = null;
    private _started: boolean = false;

    public get attrs(): Object {
        let attrs = {};
        for (let i = 0, l = this.element.attributes.length; i < l; i++) {
            attrs[this.element.attributes[i].name] = this.element.attributes[i].value;
        }
        return attrs;
    }

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