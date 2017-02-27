namespace Canvas.Renderer {
    export class Sprite extends Behavior {

        public sprite: Canvas.Sprite;

        private _maxlen: number = 0;
        private _isVisible: boolean = false;

        public get isVisible(): boolean { return this._isVisible; }

        public update() {
            this._maxlen = Math.max(this.sprite.height, this.sprite.width);
            if (
                // To the left of the stage
                this.transform.position.x + this._maxlen < 0 ||
                // Above the stage
                this.transform.position.y + this._maxlen < 0 ||
                // To the right of the stage
                this.transform.position.x - this._maxlen > Stage.width ||
                // Below the stage
                this.transform.position.y - this._maxlen > Stage.height
            ) {
                this._isVisible = false;
            } else {
                this._isVisible = true;
            }
            // if (this.sprite.animated) {
            //     if (this._frames > 0 && this._sprites.length > 0 && this.isVisible) {
            //         this._currentTime += Time.deltaTime * 0.1;
            //         let duration = this.sprite.duration;

            //         if (this._currentTime > duration * Time.deltaTime) {
            //             this._currentTime = 0;
            //             this.frame = (this.frame + 1) % this._frames;
            //         }
            //     }
            // }
        }
    }
}