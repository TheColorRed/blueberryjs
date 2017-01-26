class Keyboard {
    /**
     * Creates input event handlers for components that support it
     *
     * @static
     * @param {DOMObject[]} elements
     *
     * @memberOf Keyboard
     */
    public static inputHandler() {
        Blueberry.objects.forEach(object => {
            object.element.oninput = function (e) {
                object.components.forEach(component => {
                    if (typeof component['input'] == 'function' && e.currentTarget instanceof HTMLInputElement) {
                        e.preventDefault();
                        component['input'].bind(component).call(component, e.currentTarget.value, e);
                    }
                });
            };
        });
    }
}