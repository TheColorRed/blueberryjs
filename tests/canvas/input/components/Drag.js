(() => {
    // Define some namespaces into their own variables
    let Input = Canvas.Input;
    let Mouse = Canvas.Mouse;

    // Register the Drag Behavior
    Blueberry.register(
        class Drag extends Canvas.Behavior {
            constructor() {
                super();
                // default drag status to not dragging
                this.dragging = false;
                // The objec that we can drag
                this.object = null;
            }
            ready() {
                // Set the object to drag once everything loads
                this.object = Canvas.findByTag('skeleton');
            }
            update() {
                // If the left mouse gets pressed set dragging to true
                if (Input.mouseDown(Mouse.LEFT)) {
                    this.dragging = true;
                }
                // If the left mouse button was released set dragging to false
                if (Input.mouseReleased(Mouse.LEFT)) {
                    this.dragging = false;
                }
                // If we are dragging set the position of the object to the mouse position
                if (this.dragging) {
                    this.transform.position = Input.mousePosition;
                }
            }
        }
    );
})();