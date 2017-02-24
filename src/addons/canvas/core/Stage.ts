namespace Canvas {
    export class Stage {

        private constructor() { }

        private static _canvas: HTMLCanvasElement;
        private static _parent: HTMLElement;
        private static _ctx: CanvasRenderingContext2D | null;

        public static init(): boolean {
            this._canvas = document.querySelector('canvas') as HTMLCanvasElement;
            this._ctx = this._canvas.getContext('2d');
            this._parent = <HTMLElement>this._canvas.parentElement;
            this._canvas.addEventListener('mousemove', event => {
                Input.setMousePosition(event.offsetX, event.offsetY);
            });
            this._canvas.addEventListener('contextmenu', event => {
                event.preventDefault();
            })
            return this.initCanvas();
        }

        private static initCanvas(): boolean {
            if (this._canvas && this._parent) {
                this._canvas.style.display = 'block';
                this._canvas.width = this._parent.offsetWidth;
                this._canvas.height = this._parent.offsetHeight;
                return true;
            }
            return false;
        }

        public static render() {
            if (this._ctx instanceof CanvasRenderingContext2D) {
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                // Draw the game objects
                for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
                    let object = Blueberry.objects[i];
                    if (object instanceof GameObject) {
                        // If the object does not have a UI component draw as a game object
                        if (!object.getComponent(Renderer.UI)) {
                            let spr = object.getComponent(Renderer.Sprite);
                            if (spr) {
                                this.drawSprite(spr);
                            } else {
                                let text = object.getComponent(UI.Text);
                                if (text) {
                                    this.drawText(text);
                                }
                            }
                        }
                    }
                }

                // Draw the UI
                for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
                    let object = Blueberry.objects[i];
                    if (object instanceof GameObject) {
                        // If the item has a UI component draw as a UI element
                        if (object.getComponent(Renderer.UI)) {
                            let text = object.getComponent(UI.Text);
                            if (text) {
                                this.drawText(text);
                            }
                        }
                    }
                }
            }
        }

        private static drawSprite(spr: Renderer.Sprite) {
            if (this._ctx instanceof CanvasRenderingContext2D) {
                this._ctx.drawImage(
                    spr.sprite.image,
                    spr.transform.position.x,
                    spr.transform.position.y
                );
            }
        }

        private static drawText(text: UI.Text) {
            if (this._ctx instanceof CanvasRenderingContext2D) {
                this._ctx.font = text.font.toString();
                this._ctx.textBaseline = 'hanging';
                this._ctx.fillStyle = '#' + text.font.color.hex();
                this._ctx.fillText(text.text, text.transform.position.x, text.transform.position.y);
            }
        }

    }
}