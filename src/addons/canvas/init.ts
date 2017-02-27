namespace Canvas {

    export enum Space { Self, World };

    export function findObjectOfType<T extends Component>(type: ComponentType<T>): CanvasObject | null {
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            let object = Blueberry.objects[i];
            if (object instanceof CanvasObject && object.getComponent(type)) {
                return object;
            }
        }
        return null;
    }

    export function findObjectsOfType<T extends Component>(type: ComponentType<T>): CanvasObject[] {
        let gos: CanvasObject[] = [];
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            let object = Blueberry.objects[i];
            if (object instanceof CanvasObject && object.getComponent(type)) {
                gos.push(object);
            }
        }
        return gos;
    }

    export function findByTag(tag: string): CanvasObject | null {
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            let object = Blueberry.objects[i];
            if (object instanceof CanvasObject && object.tag == tag) {
                return object;
            }
        }
        return null;
    }

    export function findObjectsByTag(tag: string): CanvasObject[] {
        let gameObjects: CanvasObject[] = [];
        for (let i = 0, l = Blueberry.objects.length; i < l; i++) {
            let object = Blueberry.objects[i];
            if (object instanceof CanvasObject && object.tag == tag) {
                gameObjects.push(object);
            }
        }
        return gameObjects;
    }

    export function destroy() {

    }

    Blueberry.registerAddon(
        class GameAddon extends Addon {

            public init() {
                if (Stage.init()) {
                    window.requestAnimationFrame(this.render.bind(this));

                    // Listen for when the user presses a key
                    window.addEventListener('keydown', event => {
                        Input.setKeyPressed(event.keyCode);
                    });

                    // Listen for when the user releases a key
                    window.addEventListener('keyup', event => {
                        Input.setKeyReleased(event.keyCode);
                    });

                    window.addEventListener('mousedown', event => {
                        Input.setMousePressed(event.button);
                    });

                    window.addEventListener('mouseup', event => {
                        Input.setMouseReleased(event.button);
                    });
                } else {
                    console.warn('Could not initalize the canvas');
                }
            }

            public endTick() {
                Input.clearKeyDown();
                Input.clearMouseDown();
            }

            private render() {
                Stage.render();
                window.requestAnimationFrame(this.render.bind(this));
            }
        }
    );
}