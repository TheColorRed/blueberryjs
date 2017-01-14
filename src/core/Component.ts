abstract class Component extends BlueberryObject {

    public observable: Observable = null;
    private started: boolean = false;

    public getObservables() {
        this.observable = new Observable(this['observe'](), this.object);
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
                element.value = typeof observeVal == 'function' ? observeVal() : observeVal;
            }
        }
    }

}