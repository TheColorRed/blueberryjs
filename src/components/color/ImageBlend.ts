interface ImageBlendSettings {
    url: string,
    x?: number,
    y?: number,
    blendType?: BlendType
}
interface Component {
    dom: Dom
}
Blueberry.register(
    class ImageBlend extends Component {

        private _settings: ImageBlendSettings[] = [];
        private _master: { canvas: HTMLCanvasElement | null, context: CanvasRenderingContext2D | null } = { canvas: null, context: null };
        private _canvases: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null, settings: ImageBlendSettings }[] = [];

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
            let ctx = can.getContext('2d') || new CanvasRenderingContext2D();
            let actx = a.getContext('2d') || new CanvasRenderingContext2D();
            let bctx = b.getContext('2d') || new CanvasRenderingContext2D();
            let aData = actx.getImageData(0, 0, a.width, a.height).data;
            let bData = ctx.getImageData(0, 0, b.width, b.height).data;
            let finalData = ctx.createImageData(can.width, can.height);
            for (let i = 0, l = aData.length; i < l; i += 4) {
                let col: Color = Color.blend(
                    new Color(aData[i], aData[i + 1], aData[i + 2], aData[i + 3]),
                    new Color(bData[i], bData[i + 1], bData[i + 2], bData[i + 3]),
                    blendType
                );
                finalData.data[i + 0] = col.r;
                finalData.data[i + 1] = col.g;
                finalData.data[i + 2] = col.b;
                finalData.data[i + 3] = col.a;
            }
            ctx.putImageData(finalData, 0, 0);
            return can;
        }
    }
);