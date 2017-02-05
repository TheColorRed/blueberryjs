class Mathf {
    public static lerp(start: number, end: number, time: number) {
        return (1 - time) * start + time * end;
        // return start + time * (end - start);
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static clamp01(value: number): number {
        return this.clamp(value, 0, 1);
    }

    public static invert(value: number, max: number): number {
        return Math.abs(value - max);
    }

    public static invert01(value: number): number {
        return Math.abs(value - 1);
    }
}