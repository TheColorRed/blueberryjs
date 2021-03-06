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
        private static _offscreenCanvases: CanvasStageObject = { canvas: null, context: null };
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

                this._offscreenCanvas.canvas = document.createElement('canvas');
                this._offscreenCanvas.canvas.width = this._onscreenCanvas.canvas.width;
                this._offscreenCanvas.canvas.height = this._onscreenCanvas.canvas.height;
                this._offscreenCanvas.context = this._offscreenCanvas.canvas.getContext('2d');
                return true;
            }
            return false;
        }

        // private static clearCanvases() {
        //     this._offscreenCanvases.forEach(canvas => {
        //         if (canvas.context && canvas.width && canvas.height) {
        //             canvas.context.clearRect(0, 0, canvas.width, canvas.height);
        //         }
        //     });
        // }

        public static render() {
            // if (
            //     this._onscreenCanvas.context &&
            //     this._onscreenCanvas.canvas &&
            //     this._offscreenCanvases.length > 0
            // ) {
            //     this.clearCanvases();
            //     for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            //         let object = Blueberry.objects[i];
            //         if (object instanceof CanvasObject) {
            //             if (!object.getComponent(Renderer.UI)) {
            //                 let spr = object.getComponent(Renderer.Sprite);
            //                 if (spr) {
            //                     this.drawSprite(spr);
            //                 }
            //             }
            //         }
            //     }
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
                // this._onscreenCanvas.context.clearRect(0, 0, Stage.width, Stage.height);
                // this._offscreenCanvases.forEach(canvas => {
                //     if (canvas.canvas && this._onscreenCanvas.context && canvas.x) {
                //         this._onscreenCanvas.context.drawImage(canvas.canvas, canvas.x, 0);
                //     }
                // });
                this._onscreenCanvas.context.clearRect(0, 0, this._onscreenCanvas.canvas.width, this._onscreenCanvas.canvas.height)
                this._onscreenCanvas.context.drawImage(
                    this._offscreenCanvas.canvas, 0, 0,
                    Stage.width, Stage.height, 0, 0, Stage.width, Stage.height
                );
            }
        }

        private static drawSprite(spr: Renderer.Sprite) {
            // let x = (spr.transform.position.x) << 0;
            // let y = (spr.transform.position.y) << 0;
            // let width = spr.sprite.width;
            // let height = spr.sprite.height;
            // let canvases = this.getCanvases(x, width);
            // canvases.forEach(canvas => {
            //     if (canvas.context && canvas.x) {
            //         canvas.context.drawImage(spr.sprite.image, canvas.x - x, y);
            //     }
            // });
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

        // private static getCanvases(itemX: number, itemW: number): CanvasStageObject[] {
        //     let canvases: CanvasStageObject[] = [];
        //     let itemR = itemX + itemW;
        //     this._offscreenCanvases.forEach(canvas => {
        //         if (
        //             (itemX > canvas.x && itemX < canvas.x + canvas.width) ||
        //             (itemR > canvas.x && itemR < canvas.x + canvas.width)
        //         ) {
        //             canvases.push(canvas);
        //         }
        //     });
        //     return canvases;
        // }

    }
}