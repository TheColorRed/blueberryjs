(() => {
    // Define some localized namespaces
    let UI = Canvas.UI;
    let Input = Canvas.Input;

    // Register the Behavior
    Blueberry.register(
        class RenderingCounter extends Canvas.Behavior {
            constructor() {
                super();
                this.total = 0;
                this.ui = null;
            }
            created() {
                this.ui = this.addComponent(Canvas.Renderer.UI);
                this.text = this.addComponent(Canvas.UI.Text);
                this.text.font = this.getFont();
                this.transform.position = new Vector2(10, 25);
            }
            update() {
                let rendering = 0;
                for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
                    let obj = Blueberry.objects[i];
                    let spr;
                    if ((spr = obj.getComponent(Canvas.Renderer.Sprite)) && spr.isVisible) {
                        rendering++;
                    }
                }
                this.text.text = 'Items Rendering: ' + rendering;
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