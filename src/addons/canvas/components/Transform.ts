namespace Canvas {
    export class Transform extends Behavior {

        public position: Vector2 = Vector2.zero;
        public scale: Vector2 = Vector2.zero;
        public rotation: Rotation = Rotation.right;

        public translate(x: Vector2 | number, y: number): this {
            if (arguments.length == 1 && x instanceof Vector2) {
                this.position = new Vector2(
                    this.position.x + x.x,
                    this.position.y + x.y
                );
            } else if (arguments.length == 2 && typeof x == 'number') {
                this.position = new Vector2(this.position.x + x, this.position.y + y);
            }
            return this;
        }

        public rotate(rotation: Rotation | number): this {
            if (rotation instanceof Rotation) {
                this.rotation = new Rotation(this.rotation.degrees + rotation.degrees);
            } else if (typeof rotation == 'number') {
                this.rotation = new Rotation(this.rotation.degrees + rotation);
            }
            return this;
        }

    }
}