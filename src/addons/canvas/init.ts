Blueberry.registerAddon(
    class GameAddon extends Addon {

        public init() {
            if (Stage.init()) {
                window.requestAnimationFrame(this.render.bind(this));
            } else {
                console.warn('Could not initalize the canvas');
            }
        }

        private render() {
            Stage.render();
            window.requestAnimationFrame(this.render.bind(this));
        }
    }
);