Blueberry.register(
    class Letter extends Component {
        created() {
            this.dom.content(this.toLetter(this.dom.value));
        }
        input(value) {
            this.dom.content(this.toLetter(value));
        }
        toLetter(value) {
            return value
                // Remove anything that isnt' a letter or space
                .replace(/[^a-zA-Z ]/g, '')
        }
    }
);