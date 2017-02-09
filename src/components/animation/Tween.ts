Blueberry.register(
    class Tween extends Component {
        private isRunning: boolean = false;
        private reverse: boolean = false;
        private percentage = 0;
        private time = 0;
        private initPos = Vector2.zero;
        private initScale = Vector2.zero;
        private runningTime = 0;
        private settings: {
            duration?: number,
            easeType?: EaseType,
            loopType?: LoopType,
            tweenType?: TweenType,
            units?: number,
            endx?: number,
            endy?: number,
            endScale?: Vector2,
            initPos?: Vector2,
            endPos?: Vector2,
            startPos?: Vector2
        } = {};

        private tweenType: TweenType;
        private endVector: Vector2;
        private endScale: Vector2;

        private duration = this.settings.duration || 2;
        private easeType = this.settings.easeType || EaseType.Linear;
        private loopType = this.settings.loopType || LoopType.None;
        private units = this.settings.units || 'px';
        private endPos = new Vector2(this.settings.endx || 0, this.settings.endy || 0);

        public created() {
            this.isRunning = false;
            this.percentage = 0;
            this.time = 0;
            this.initPos = Vector2.zero;
            this.runningTime = 0;
            this.parent.style.set({ position: 'relative' });
            this.style.set({ position: 'absolute' });
            this.settings = eval(`(${this.attrs.settings})`);

            this.duration = this.settings.duration || 2;
            this.easeType = this.settings.easeType || EaseType.Linear;
            this.loopType = this.settings.loopType || LoopType.None;
            this.units = this.settings.units || 'px';
            this.endPos = new Vector2(this.settings.endx || 0, this.settings.endy || 0);

            if (this.tweenType == TweenType.Scale) {
                this.endVector = this.settings.endScale || Vector2.one;
            } else if (this.tweenType == TweenType.Move) {
                this.endVector = this.settings.endPos || Vector2.one;
            }
        }

        public update() {
            if (this.isRunning) {
                if (!this.reverse) {
                    if (this.percentage < 1) {
                        this.tweenUpdate();
                    } else {
                        this.tweenComplete();
                    }
                } else {
                    if (this.percentage > 0) {
                        this.tweenUpdate();
                    } else {
                        this.tweenComplete();
                    }
                }
            }
        }
        public updatePercentage() {
            this.runningTime += Time.deltaTime;
            if (this.reverse) {
                this.percentage = 1 - this.runningTime / this.duration;
                this.time -= Time.deltaTime / this.duration;
            } else {
                this.percentage = this.runningTime / this.duration;
                this.time += Time.deltaTime / this.duration;
            }
        }
        public tweenUpdate() {
            switch (this.settings.tweenType) {
                case TweenType.Move: this.moveTarget(); break;
                case TweenType.Scale: this.scaleTarget(); break;
                // case TweenType.Color: this.colorTarget(); break;
            }
            this.updatePercentage();
        }
        public tweenComplete() {
            if (this.loopType == LoopType.None) {
                this.isRunning = false;
            } else {
                switch (this.loopType) {
                    case LoopType.Repeat:
                        this.percentage = 0;
                        this.runningTime = 0;
                        this.time = 0;
                        this.style.set({
                            left: this.initPos.x.toString() + this.units,
                            top: this.initPos.y.toString() + this.units
                        });
                        break;
                    case LoopType.PingPong:
                        this.reverse = !this.reverse;
                        this.runningTime = 0;
                        break;
                }
            }
        }

        public moveTarget() {
            let start = this.settings.startPos || Vector2.zero;
            let end = this.endPos || Vector2.zero;
            this.style.set({
                left: TweenFx.animate(this.initPos.x, end.x, this.time, this.easeType).toString() + this.units,
                top: TweenFx.animate(this.initPos.y, end.y, this.time, this.easeType).toString() + this.units
            });
        }

        public scaleTarget() {
            let end = this.settings.endScale || Vector2.one;
            this.style.set({
                width: TweenFx.animate(this.initScale.x, end.x, this.time, this.easeType).toString() + this.units,
                height: TweenFx.animate(this.initScale.y, end.y, this.time, this.easeType).toString() + this.units
            });
        }

        // colorTarget() {
        //     let end = this.settings.endColor || Color.white;
        //     let color = new Color(
        //         Math.round(TweenFx.animate(this.initColor.r, end.r, this.time, this.easeType)),
        //         Math.round(TweenFx.animate(this.initColor.g, end.g, this.time, this.easeType)),
        //         Math.round(TweenFx.animate(this.initColor.b, end.b, this.time, this.easeType))
        //     );
        //     this.style.set('background-color', '#' + color.hex());
        // }
        public start() {
            this.isRunning = true;
        }
        public stop() {
            this.isRunning = false;
        }
        public toggle() {
            this.isRunning = !this.isRunning;
        }
    }
);
