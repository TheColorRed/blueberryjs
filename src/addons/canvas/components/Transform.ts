class Transform extends Behavior {

    public position: Vector2 = Vector2.zero;
    public scale: Vector2 = Vector2.zero;
    public rotation: Rotation = Rotation.right;

    public translate(translation: Vector2): this {
        this.position = new Vector2(
            this.position.x + translation.x,
            this.position.y + translation.y
        );
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