Blueberry.registerAddon(
    class DOMObjectAddon extends Addon {
        public init() {
            DOMObject.initElementsWithComponent();
            MouseHandler.clickHandlers();
        }
    }
);