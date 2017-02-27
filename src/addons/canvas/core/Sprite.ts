namespace Canvas {
    export class Sprite {

        private _url: string = '';
        private _image: HTMLImageElement;
        // private _image: HTMLCanvasElement;
        private _loaded: boolean = false;

        public get height(): number {
            return this._image.height;
        }

        public get width(): number {
            return this._image.width;
        }

        public constructor(url: string) {
            this._url = url;
            // let img = new Image();
            // img.src = this._url;
            // this._image = document.createElement('canvas');
            // img.onload = () => {
            //     let ctx = this._image.getContext('2d');
            //     if (ctx) {
            //         this._image.width = img.width;
            //         this._image.height = img.height;
            //         ctx.drawImage(img, 0, 0);
            //     }
            // }
            this._image = new Image();
            this._image.src = this._url;
            this._image.onload = () => {
                this._loaded = true;
            }
        }

        public get image(): HTMLImageElement {
            // public get image(): HTMLCanvasElement {
            return this._image;
        }

    }
}