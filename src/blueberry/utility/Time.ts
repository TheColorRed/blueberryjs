class Time {
    private static _deltaTime: number = 0;
    private static _time: number = 0;

    private static _lastLoopTime: number = Time.getNanoSeconds;
    private static _targetFps: number = 120;
    private static _startTime: number = new Date().getTime();
    private static _optimalTime: number = 1000000000 / Time._targetFps;
    private static _lastFpsTime: number = 0;
    private static _nanoSeconds: number = 0;

    public static get deltaTime(): number {
        return this._deltaTime;
    }

    public static get time(): number {
        return this._time;
    }

    public static setDeltaTime(time: number) {
        this._deltaTime = time;
    }

    public static setFrameTime(time: number) {
        this._time = time;
    }

    public static get getNanoSeconds(): number {
        return (new Date()).getTime() * 1000000;
    }

    public static frameTime() {
        let d = new Date().getTime();
        this._nanoSeconds = Time.getNanoSeconds;
        let now = this._nanoSeconds;
        let updateLength = now - Time._lastLoopTime;
        Time._lastLoopTime = now;
        let delta = updateLength / Time._optimalTime;
        Time._lastFpsTime += updateLength;
        if (Time._lastFpsTime >= 1000000000) {
            Time._lastFpsTime = 0;
        }
        Time.setFrameTime((d - Time._startTime) / 1000);
        Time.setDeltaTime(delta / Time._targetFps);
    }

    public static nextCalc() {
        return (this._lastLoopTime - this._nanoSeconds + this._optimalTime) / 1000000;
    }

    public static timeSince(date) {
        var seconds = Math.floor(((<any>new Date()) - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }
}