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
                this.text.font = this.getFont();
                this.transform.position = new Vector2(10, 10);
            }
            update() {
                this.text.text = 'Total Items: ' + Blueberry.objects.length;
            }

            getFont(){
                let font = new Canvas.UI.Font;
                font.color = Color.red;
                font.style = Canvas.UI.FontStyle.Bold;
                return font;
            }
        }
    );
})();