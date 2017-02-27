(() => {
    // Define some localized namespaces
    let UI = Canvas.UI;
    let Input = Canvas.Input;

    // Register the Behavior
    Blueberry.register(
        class Move extends Canvas.Behavior {
            constructor() {
                super();
                this.speed = 3;
            }
            update() {
                // Get the users x/y inputs (-1, 0, 1)
                let horizontal = Input.getAxis('horizontal') * this.speed;
                let vertical = Input.getAxis('vertical') * this.speed;
                // Translate the object between points
                this.transform.translate(horizontal, vertical);
            }
        }
    );
})();