class Stage {

    private constructor() { }

    private static _canvas: HTMLCanvasElement;
    private static _parent: HTMLElement;
    private static _ctx: CanvasRenderingContext2D | null;

    public static init(): boolean {
        this._canvas = document.querySelector('canvas') as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d');
        this._parent = <HTMLElement>this._canvas.parentElement;
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
            Blueberry.objects.forEach(object => {
                if (object instanceof GameObject) {
                    let spr = object.getComponent(SpriteRenderer);
                    if (spr && this._ctx instanceof CanvasRenderingContext2D) {
                        this._ctx.drawImage(
                            spr.sprite.image,
                            spr.transform.position.x,
                            spr.transform.position.y
                        );
                    }
                }
            });
        }
    }

}