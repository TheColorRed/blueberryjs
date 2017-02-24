class Sprite {

    private _url: string = '';
    private _image: HTMLImageElement;
    private _loaded: boolean = false;

    public constructor(url: string) {
        this._url = url;
        this._image = new Image();
        this._image.src = this._url;
        this._image.onload = () => {
            this._loaded = true;
        }
    }

    public get image(): HTMLImageElement {
        return this._image;
    }

}