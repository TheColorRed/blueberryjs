class KeyboardHandler {
    /**
     * Creates input event handlers for components that support it
     *
     * @static
     * @param {DOMObject[]} elements
     *
     * @memberOf Keyboard
     */
    public static inputHandler() {
        // Blueberry.objects.forEach(object => {
        //     if (!object.element.oninput && object.element instanceof HTMLInputElement) {
        //         object.element.oninput = function (e) {
        //             object.components.forEach(component => {
        //                 if (typeof component['input'] == 'function') {
        //                     component['input'].bind(component).call(component, (<HTMLInputElement>e.currentTarget).value, e);
        //                 }
        //             });
        //         };
        //     }
        //     if (!object.element.onkeydown) {
        //         object.element.onkeydown = function (e) {
        //             object.components.forEach(component => {
        //                 if (typeof component['keyDown'] == 'function' && e.currentTarget instanceof HTMLInputElement) {
        //                     component['keyDown'].bind(component).call(component, e);
        //                 }
        //             });
        //         };
        //     }
        // });
    }
}