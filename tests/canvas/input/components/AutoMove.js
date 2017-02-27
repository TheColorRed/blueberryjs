(() => {
    // Define some localized namespaces
    let UI = Canvas.UI;
    let Input = Canvas.Input;

    // Register the Behavior
    Blueberry.register(
        class AutoMove extends Canvas.Behavior {
            constructor() {
                super();
                this.speed = 3;
            }
            update() {
                // Translate the object between points
                this.transform.translate(this.speed, 0);
            }
        }
    );
})();