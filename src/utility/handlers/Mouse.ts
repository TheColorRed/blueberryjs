class Mouse {
    /**
     * Creates click event handlers for components that support it
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    public static clickHandler() {
        Blueberry.objects.forEach(object => {
            object.element.onclick = function (e) {
                object.components.forEach(component => {
                    if (typeof component['click'] == 'function') {
                        e.preventDefault();
                        component['click'].bind(component).call(component, e);
                    }
                });
            };
        });
    }

    /**
     * Creates double click event handlers for components that support it
     *
     * @private
     * @static
     *
     * @memberOf Blueberry
     */
    public static dblClickHandler() {
        Blueberry.objects.forEach(object => {
            object.element.onclick = function (e) {
                object.components.forEach(component => {
                    if (typeof component['doubleClick'] == 'function') {
                        e.preventDefault();
                        component['doubleClick'].bind(component).call(component, e);
                    }
                });
            };
        });
    }
}