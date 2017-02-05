class Time {
    private static _deltaTime: number = 0;
    private static _time: number = 0;

    private static _lastLoopTime: number = Time.getNanoSeconds;
    private static _targetFps: number = 30;
    private static _startTime: number = new Date().getTime();
    private static _optimalTime: number = 1000000000 / Time._targetFps;
    private static _lastFpsTime: number = 0;

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
        let nanoSeconds = Time.getNanoSeconds;
        let now = nanoSeconds;
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
}