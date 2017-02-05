Blueberry.register(
    class Number extends Component {
        created() {
            this.dom.content(this.toNumber(this.dom.value));
        }
        input(value) {
            this.dom.content(this.toNumber(value));
        }
        toNumber(value) {
            return value
                // Remove anything that isn't valid in a number
                .replace(/[^0-9-.]/g, '')
                // Remove all dashes unless it is the first character
                .replace(/(?!^)-/g, '')
                // Remove the last period if there is already one
                .replace(/(\..*)\.$/, '$1')
                // Remove all trailing periods
                .replace(/\.(?=.*\.)/g, '');
        }
    }
);