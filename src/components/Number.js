Blueberry.register(
    class Number extends Component {
        input(value) {
            value = value
                .replace(/[^0-9-.]/g, '')
                .replace(/(?!^)-/g, '')
                .replace(/(?!)\./g, '');
            this.dom.content(value);
        }
    }
);