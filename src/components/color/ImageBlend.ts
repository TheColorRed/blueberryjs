Blueberry.register(
    class ImageBlend extends Component {
        private _settings: { url: string, x?: number, y?: number, blendType: BlendType }[] = [];

        private _master: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } = { canvas: null, context: null };
        private _canvases: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, settings: { url: string, x?: number, y?: number, blendType: BlendType } }[] = [];

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

        public async ready() {
            for (let i = 0, l = this._canvases.length; i < l; i++) {
                let item = this._canvases[i];
                let img = await this.loadImage(item.settings.url);
                item.canvas.width = img.width;
                item.canvas.height = img.height;
                item.context.drawImage(img, 0, 0);
                if (i == 0) {
                    this._master.canvas.width = img.width;
                    this._master.canvas.height = img.height;
                    this._master.context.drawImage(item.canvas, 0, 0);
                } else {
                    let canvas = this.blend(this._master.canvas, item.canvas, item.settings.blendType);
                    this._master.context.drawImage(canvas, 0, 0);
                }
            }
            this.dom.html(`<img src="${this._master.canvas.toDataURL()}">`);
        }

        private loadImage(url): Promise<HTMLImageElement> {
            return new Promise(resolve => {
                let img: HTMLImageElement = new Image();
                img.src = url;
                img.onload = () => {
                    resolve(img);
                };
            });
        }

        private blend(a: HTMLCanvasElement, b: HTMLCanvasElement, blendType: BlendType): HTMLCanvasElement {
            let can = document.createElement('canvas');
            can.width = a.width;
            can.height = a.height;
            let ctx = can.getContext('2d');
            let ad = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
            let bd = b.getContext('2d').getImageData(0, 0, b.width, b.height).data;
            let d = ctx.createImageData(a.width, a.height);
            for (let i = 0, l = ad.length; i < l; i += 4) {
                let c: Color = Color.blend(
                    new Color(ad[i], ad[i + 1], ad[i + 2], ad[i + 3]),
                    new Color(bd[i], bd[i + 1], bd[i + 2], bd[i + 3]),
                    blendType
                );
                d.data[i + 0] = c.r;
                d.data[i + 1] = c.g;
                d.data[i + 2] = c.b;
                d.data[i + 3] = c.a;
            }
            ctx.putImageData(d, 0, 0);
            return can;
        }
    }
);