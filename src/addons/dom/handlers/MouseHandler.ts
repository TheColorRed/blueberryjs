class MouseHandler {
    /**
     * Creates click event handlers for components that support it
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    public static clickHandlers() {
        Blueberry.objects.forEach(object => {
            if (!object.element.onclick) {
                object.element.onclick = function (e) {
                    object.components.forEach(component => {
                        if (typeof component['click'] == 'function') {
                            e.preventDefault();
                            let target = DOMObject.toObject(<HTMLElement>e.target);
                            component['click'].bind(component).call(component, target, e);
                        }
                    });
                }
            }
            if (!object.element.ondblclick) {
                object.element.ondblclick = function (e) {
                    object.components.forEach(component => {
                        if (typeof component['doubleClick'] == 'function') {
                            e.preventDefault();
                            component['doubleClick'].bind(component).call(component, e);
                        }
                    });
                }
            }
        });
    }
}