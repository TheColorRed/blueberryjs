(() => {
    // Define some localized namespaces
    let UI = Canvas.UI;
    let Input = Canvas.Input;

    // Register the Behavior
    Blueberry.register(
        class ItemCounter extends Canvas.Behavior {
            constructor() {
                super();
                this.total = 0;
                this.ui = null;
            }
            created() {
                this.ui = this.addComponent(Canvas.Renderer.UI);
                this.text = this.addComponent(Canvas.UI.Text);
                this.transform.position = new Vector2(10, 10);
            }
            update() {
                this.text.text = Blueberry.objects.length;
            }
        }
    );
})();