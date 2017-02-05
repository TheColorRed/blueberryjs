class BlueberryEvent {

    private _name: string = '';
    private _event: (event?: BlueberryEvent) => void;

    public get name(): string { return this._name; }
    public get event(): (event?: BlueberryEvent) => void { return this._event; }

    public constructor(name: string, event: (event: BlueberryEvent) => void) {
        this._name = name;
        this._event = event;
    }

}