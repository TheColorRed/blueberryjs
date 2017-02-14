interface TweenSettings {
    duration?: number,
    easeType?: EaseType,
    loopType?: LoopType,
    tweenType?: TweenType,
    units?: string,
    startVec?: Vector2,
    endVec?: Vector2,
    startColor?: Color,
    endColor?: Color
}

Blueberry.register(
    class Tween extends Component {
        private _isRunning: boolean = false;
        private _reverse: boolean = false;
        private _percentage = 0;
        private _time = 0;

        private _initPos = Vector2.zero;
        private _initScale = Vector2.zero;
        private _initColor = Color.black;

        private _runningTime = 0;
        private _isComplete = false;
        private _isEnabled = true;
        public settings: TweenSettings = {
            duration: 2,
            easeType: EaseType.Linear,
            loopType: LoopType.None,
            tweenType: TweenType.None,
            units: 'px',
            startVec: Vector2.zero,
            endVec: Vector2.zero,
            startColor: Color.black,
            endColor: Color.black
        };

        private _evtTweenComplete: () => void;

        public created() {
            this.parent.style.set({ position: 'relative' });
            this.style.set({ position: 'absolute' });
            // this._settings = eval(`(${this.attrs.settings})`);
            // if (this.settings.tweenType == TweenType.Scale) {
            //     this.settings.endVector = this.settings.endScale || Vector2.one;
            // } else if (this.settings.tweenType == TweenType.Move) {
            //     this.settings.endVector = this.settings.endPos || Vector2.one;
            // }
        }

        public update() {
            if (this._isRunning && this._isEnabled && !this._isComplete) {
                if (!this._reverse) {
                    if (this._percentage < 1) {
                        this.tweenUpdate();
                    } else {
                        this.tweenComplete();
                    }
                } else {
                    if (this._percentage > 0) {
                        this.tweenUpdate();
                    } else {
                        this.tweenComplete();
                    }
                }
            }
        }
        public updatePercentage() {
            this._runningTime += Time.deltaTime;
            if (this._reverse) {
                this._percentage = 1 - this._runningTime / this.settings.duration;
                this._time -= Time.deltaTime / this.settings.duration;
            } else {
                this._percentage = this._runningTime / this.settings.duration;
                this._time += Time.deltaTime / this.settings.duration;
            }
        }
        public tweenUpdate() {
            switch (this.settings.tweenType) {
                case TweenType.Move: this.moveTarget(); break;
                case TweenType.Scale: this.scaleTarget(); break;
                case TweenType.Color: this.colorTarget(); break;
            }
            this.updatePercentage();
        }
        public tweenComplete() {
            if (this.settings.loopType == LoopType.None) {
                this._isRunning = false;
                this._isComplete = true;
                this._evtTweenComplete();
            } else {
                switch (this.settings.loopType) {
                    case LoopType.Repeat:
                        this._percentage = 0;
                        this._runningTime = 0;
                        this._time = 0;
                        this.style.set({
                            left: this._initPos.x.toString() + this.settings.units,
                            top: this._initPos.y.toString() + this.settings.units
                        });
                        break;
                    case LoopType.PingPong:
                        this._reverse = !this._reverse;
                        this._runningTime = 0;
                        break;
                }
            }
        }

        public moveTarget() {
            let start = this.settings.startVec || Vector2.zero;
            let end = this.settings.endVec || Vector2.zero;
            this.style.set({
                left: TweenFx.animate(this._initPos.x, end.x, this._time, this.settings.easeType).toString() + this.settings.units,
                top: TweenFx.animate(this._initPos.y, end.y, this._time, this.settings.easeType).toString() + this.settings.units
            });
        }

        public scaleTarget() {
            let end = this.settings.endVec || Vector2.one;
            this.style.set({
                width: TweenFx.animate(this._initScale.x, end.x, this._time, this.settings.easeType).toString() + this.settings.units,
                height: TweenFx.animate(this._initScale.y, end.y, this._time, this.settings.easeType).toString() + this.settings.units
            });
        }

        colorTarget() {
            let end = this.settings.endColor || Color.white;
            let color = new Color(
                Math.round(TweenFx.animate(this._initColor.r, end.r, this._time, this.settings.easeType)),
                Math.round(TweenFx.animate(this._initColor.g, end.g, this._time, this.settings.easeType)),
                Math.round(TweenFx.animate(this._initColor.b, end.b, this._time, this.settings.easeType))
            );
            this.style.set('background-color', '#' + color.hex());
        }

        public setSetting(key: string | Object, value?: string) {
            if (typeof key == 'string') {
                this.settings[key] = value;
            } else if (key instanceof Object) {
                for (let k in key) {
                    this.settings[k] = key[k];
                }
            }
        }

        public complete(callback: () => void): this {
            this._evtTweenComplete = callback;
            return this;
        }
        public start(): this {
            this._isRunning = true;
            return this;
        }
        public stop(): this {
            this._isRunning = false;
            return this;
        }
        public toggle(): this {
            this._isRunning = !this._isRunning;
            return this;
        }

        public windowFocus() {
            this._isEnabled = true;
        }

        public windowBlur() {
            this._isEnabled = false;
        }
    }
);
