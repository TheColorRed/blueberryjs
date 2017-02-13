interface ColorSettings {
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
    startPos?: Vector2,
    initColor?: Color,
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
        private _settings: ColorSettings = {};

        private _tweenType: TweenType;
        private _endVector: Vector2;
        private _endScale: Vector2;

        private _duration = this._settings.duration || 2;
        private _easeType = this._settings.easeType || EaseType.Linear;
        private _loopType = this._settings.loopType || LoopType.None;
        private _units = this._settings.units || 'px';
        private _endPos = new Vector2(this._settings.endx || 0, this._settings.endy || 0);

        private _evtTweenComplete: () => void;

        public created() {
            this._isRunning = false;
            this._percentage = 0;
            this._time = 0;
            this._initPos = Vector2.zero;
            this._runningTime = 0;
            this.parent.style.set({ position: 'relative' });
            this.style.set({ position: 'absolute' });
            this._settings = eval(`(${this.attrs.settings})`);

            this._duration = this._settings.duration || 2;
            this._easeType = this._settings.easeType || EaseType.Linear;
            this._loopType = this._settings.loopType || LoopType.None;
            this._units = this._settings.units || 'px';
            this._endPos = new Vector2(this._settings.endx || 0, this._settings.endy || 0);

            if (this._tweenType == TweenType.Scale) {
                this._endVector = this._settings.endScale || Vector2.one;
            } else if (this._tweenType == TweenType.Move) {
                this._endVector = this._settings.endPos || Vector2.one;
            }
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
                this._percentage = 1 - this._runningTime / this._duration;
                this._time -= Time.deltaTime / this._duration;
            } else {
                this._percentage = this._runningTime / this._duration;
                this._time += Time.deltaTime / this._duration;
            }
        }
        public tweenUpdate() {
            switch (this._settings.tweenType) {
                case TweenType.Move: this.moveTarget(); break;
                case TweenType.Scale: this.scaleTarget(); break;
                case TweenType.Color: this.colorTarget(); break;
            }
            this.updatePercentage();
        }
        public tweenComplete() {
            if (this._loopType == LoopType.None) {
                this._isRunning = false;
                this._isComplete = true;
                this._evtTweenComplete();
            } else {
                switch (this._loopType) {
                    case LoopType.Repeat:
                        this._percentage = 0;
                        this._runningTime = 0;
                        this._time = 0;
                        this.style.set({
                            left: this._initPos.x.toString() + this._units,
                            top: this._initPos.y.toString() + this._units
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
            let start = this._settings.startPos || Vector2.zero;
            let end = this._endPos || Vector2.zero;
            this.style.set({
                left: TweenFx.animate(this._initPos.x, end.x, this._time, this._easeType).toString() + this._units,
                top: TweenFx.animate(this._initPos.y, end.y, this._time, this._easeType).toString() + this._units
            });
        }

        public scaleTarget() {
            let end = this._settings.endScale || Vector2.one;
            this.style.set({
                width: TweenFx.animate(this._initScale.x, end.x, this._time, this._easeType).toString() + this._units,
                height: TweenFx.animate(this._initScale.y, end.y, this._time, this._easeType).toString() + this._units
            });
        }

        colorTarget() {
            let end = this._settings.endColor || Color.white;
            let color = new Color(
                Math.round(TweenFx.animate(this._initColor.r, end.r, this._time, this._easeType)),
                Math.round(TweenFx.animate(this._initColor.g, end.g, this._time, this._easeType)),
                Math.round(TweenFx.animate(this._initColor.b, end.b, this._time, this._easeType))
            );
            this.style.set('background-color', '#' + color.hex());
        }

        public setSetting(key: string | Object, value?: string) {
            if (typeof key == 'string') {
                this._settings[key] = value;
            } else if (key instanceof Object) {
                for (let k in key) {
                    this._settings[k] = key[k];
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
