Blueberry.register(
    class Letter extends Component {
        public created() {
            this.dom.content(this.toLetter(this.dom.value));
        }
        public input(value) {
            this.dom.content(this.toLetter(value));
        }
        private toLetter(value) {
            return value
                // Remove anything that isnt' a letter or space
                .replace(/[^a-zA-Z ]/g, '')
        }
    }
);