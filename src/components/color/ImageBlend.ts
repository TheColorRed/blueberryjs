interface ImageBlendSettings {
    url: string,
    x?: number,
    y?: number,
    blendType?: BlendType
}

Blueberry.register(
    class ImageBlend extends Component {

        private _settings: ImageBlendSettings[] = [];
        private _master: { canvas: HTMLCanvasElement | null, context: CanvasRenderingContext2D | null } = { canvas: null, context: null };
        private _canvases: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null, settings: ImageBlendSettings }[];

        /**
         * Create the base canvas and load the settings
         */
        public created() {
            this._master.canvas = document.createElement('canvas');
            this._master.context = this._master.canvas.getContext('2d');
            this._settings = eval(`(${this.attrs.settings})`);
            this._settings.forEach(setting => {
                let cvs = document.createElement('canvas');
                let ctx = cvs.getContext('2d');
                this._canvases.push({ canvas: cvs, context: ctx, settings: setting });
            });
        }

        /**
         * Once everything is ready, loop through the canvases and blend them together
         */
        public async ready() {
            for (let i = 0, l = this._canvases.length; i < l; i++) {
                let item = this._canvases[i];
                let img = await this.loadImage(item.settings.url);
                item.canvas.width = img.width;
                item.canvas.height = img.height;
                if (!item.context) { continue; }
                item.context.drawImage(img, 0, 0);
                if (this._master.canvas && this._master.context && i == 0) {
                    this._master.canvas.width = img.width;
                    this._master.canvas.height = img.height;
                    this._master.context.drawImage(item.canvas, 0, 0);
                } else if (this._master.canvas && this._master.context) {
                    let canvas = this.blend(this._master.canvas, item.canvas, (item.settings.blendType || BlendType.Normal));
                    this._master.context.drawImage(canvas, 0, 0);
                }
            }
            if (this.element instanceof HTMLImageElement && this._master.canvas) {
                this.dom.attr('src', this._master.canvas.toDataURL());
            } else if (this._master.canvas) {
                this.dom.html(`<img alt="Image Blend" src="${this._master.canvas.toDataURL()}">`);
            }
        }

        /**
         * Loads an image from a url
         *
         * @private
         * @param {any} url
         * @returns {Promise<HTMLImageElement>}
         */
        private loadImage(url): Promise<HTMLImageElement> {
            return new Promise(resolve => {
                let img: HTMLImageElement = new Image();
                img.src = url;
                img.onload = () => {
                    resolve(img);
                };
            });
        }

        /**
         * Blends two canvases together with a particular blend type
         *
         * @private
         * @param {HTMLCanvasElement} a
         * @param {HTMLCanvasElement} b
         * @param {BlendType} blendType
         * @returns {HTMLCanvasElement}
         */
        private blend(a: HTMLCanvasElement, b: HTMLCanvasElement, blendType: BlendType): HTMLCanvasElement {
            let can = document.createElement('canvas');
            can.width = a.width > b.width ? a.width : b.width;
            can.height = a.height > b.height ? a.height : b.height;
            let ctx = can.getContext('2d');
            if (!ctx) { return b; }
            let actx = a.getContext('2d');
            if (!actx) { return a; }
            let ad = actx.getImageData(0, 0, a.width, a.height).data;
            let bctx = b.getContext('2d');
            if (!bctx) { return b; }
            let bd = ctx.getImageData(0, 0, b.width, b.height).data;
            let d = ctx.createImageData(a.width, a.height);
            for (let i = 0, l = ad.length; i < l; i += 4) {
                let col: Color = Color.blend(
                    new Color(ad[i], ad[i + 1], ad[i + 2], ad[i + 3]),
                    new Color(bd[i], bd[i + 1], bd[i + 2], bd[i + 3]),
                    blendType
                );
                d.data[i + 0] = col.r;
                d.data[i + 1] = col.g;
                d.data[i + 2] = col.b;
                d.data[i + 3] = col.a;
            }
            ctx.putImageData(d, 0, 0);
            return can;
        }
    }
);