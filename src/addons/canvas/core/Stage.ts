interface CanvasStageObject {
    canvas: HTMLCanvasElement | null,
    context: CanvasRenderingContext2D | null
    width?: number, height?: number,
    x?: number, y?: number
}

namespace Canvas {
    export class Stage {

        private constructor() { }

        private static _onscreenCanvas: CanvasStageObject = { canvas: null, context: null };
        private static _offscreenCanvas: CanvasStageObject = { canvas: null, context: null };
        private static _parent: HTMLElement;

        public static get width(): number {
            return this._onscreenCanvas.canvas ? this._onscreenCanvas.canvas.width : 0;
        }

        public static get height(): number {
            return this._onscreenCanvas.canvas ? this._onscreenCanvas.canvas.height : 0;
        }

        public static init(): boolean {
            // Prepare the onscreen canvas
            this._onscreenCanvas.canvas = document.querySelector('canvas') as HTMLCanvasElement;
            this._onscreenCanvas.context = this._onscreenCanvas.canvas.getContext('2d');
            this._parent = <HTMLElement>this._onscreenCanvas.canvas.parentElement;
            this._onscreenCanvas.canvas.addEventListener('mousemove', event => {
                Input.setMousePosition(event.offsetX, event.offsetY);
            });
            this._onscreenCanvas.canvas.addEventListener('contextmenu', event => {
                event.preventDefault();
            });

            return this.initCanvas();
        }

        private static initCanvas(): boolean {
            if (this._onscreenCanvas && this._onscreenCanvas.canvas && this._parent) {
                this._onscreenCanvas.canvas.style.display = 'block';
                this._onscreenCanvas.canvas.width = this._parent.offsetWidth;
                this._onscreenCanvas.canvas.height = this._parent.offsetHeight;

                // Prepare the offscreen canvas
                // for (let i = 0; i < 8; i++) {
                //     let c = document.createElement('canvas');
                //     c.width = Stage.width;
                //     c.height = Stage.height;
                //     let cx = c.getContext('2d');
                //     let canvas: CanvasStageObject = {
                //         canvas: c, context: cx,
                //         width: Stage.width / 8,
                //         height: Stage.height,
                //         x: (Stage.width / 8) * i,
                //         y: 0
                //     };
                // this._offscreenCanvas.push(canvas);
                this._offscreenCanvas.canvas = document.createElement('canvas');
                this._offscreenCanvas.canvas.width = this._onscreenCanvas.canvas.width;
                this._offscreenCanvas.canvas.height = this._onscreenCanvas.canvas.height;
                this._offscreenCanvas.context = this._offscreenCanvas.canvas.getContext('2d');
                // }
                return true;
            }
            return false;
        }

        public static render() {
            if (
                this._offscreenCanvas.context instanceof CanvasRenderingContext2D &&
                this._onscreenCanvas.context instanceof CanvasRenderingContext2D &&
                this._offscreenCanvas.canvas && this._onscreenCanvas.canvas
            ) {
                this._offscreenCanvas.context.clearRect(0, 0, this._offscreenCanvas.canvas.width, this._offscreenCanvas.canvas.height);
                // Draw the game objects
                for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
                    let object = Blueberry.objects[i];
                    if (object instanceof CanvasObject) {
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
                    if (object instanceof CanvasObject) {
                        // If the item has a UI component draw as a UI element
                        if (object.getComponent(Renderer.UI)) {
                            let text = object.getComponent(UI.Text);
                            if (text) {
                                this.drawText(text);
                            }
                        }
                    }
                }
                this._onscreenCanvas.context.clearRect(0, 0, this._onscreenCanvas.canvas.width, this._onscreenCanvas.canvas.height)
                this._onscreenCanvas.context.drawImage(
                    this._offscreenCanvas.canvas, 0, 0,
                    Stage.width, Stage.height, 0, 0, Stage.width, Stage.height
                );
            }
        }

        private static drawSprite(spr: Renderer.Sprite) {
            if (this._offscreenCanvas.context instanceof CanvasRenderingContext2D && spr.isVisible) {
                this._offscreenCanvas.context.drawImage(
                    spr.sprite.image,
                    (spr.transform.position.x) << 0,
                    (spr.transform.position.y) << 0
                );
            }
        }

        private static drawText(text: UI.Text) {
            if (this._offscreenCanvas.context instanceof CanvasRenderingContext2D) {
                this._offscreenCanvas.context.font = text.font.toString();
                this._offscreenCanvas.context.textBaseline = 'hanging';
                this._offscreenCanvas.context.fillStyle = '#' + text.font.color.hex();
                this._offscreenCanvas.context.fillText(text.text, (text.transform.position.x) << 0, (text.transform.position.y) << 0);
            }
        }

    }
}