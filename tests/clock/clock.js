/// <reference path="../../dist/blueberry.d.ts"/>

// Registers the clock component to Blueberry for usage
Blueberry.register(
    class Clock extends Component {
        // Update the text on every animation frame (about 60 times per second).
        update() {
            // By using content instead of html/text data will be inserted as text
            // or an input value based on the type of element that this component is attached to.
            // If the component is attached to the document or window nothing will happen.
            this.dom.content(new Date().toLocaleTimeString());
        }
    }
);