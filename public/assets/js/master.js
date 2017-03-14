$(document).ready(e => {
    $(".button-collapse").sideNav();
});

Blueberry.register(
    class VersionSelect extends Behavior {
        created() {
            this.cdn = 'http://cdn.blueberryjs.com';
            Exp.one(this.dom.attrs.default, 'true', '1') ? this.setVersion() : null;
        }
        click() {
            this.setVersion();
        }
        setVersion() {
            // Reset all the buttons
            Dom.findByComponent(VersionSelect).removeClass('red').addClass('blue');
            // Make the selected button red
            this.class.add('red').remove('blue');
            // Update the dom
            this.setLink(Dom.find('#script-link-core'), this.dom.attrs.version, 'blueberry');
            this.setLink(Dom.find('#script-link-dom'), this.dom.attrs.version, 'dom');
            this.setLink(Dom.find('#script-link-canvas'), this.dom.attrs.version, 'canvas');
        }
        setLink(item, version, file) {
            item.dom.html(Prism.highlight(`<script src="${this.cdn}/${version}/${file}.js"></script>`, Prism.languages.markup));
        }
    }
);