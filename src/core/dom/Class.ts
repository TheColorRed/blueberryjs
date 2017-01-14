class Class extends Dom {

    public has(className: string): boolean {
        let classes = className.split(' ');
        for (let i = 0, l = classes.length; i < l; i++) {
            if (this.element.classList.contains(classes[i])) {
                return true;
            }
        }
        return false;
    }

    public add(className: string) {
        className.split(' ').forEach(c => {
            this.element.classList.add(c);
        });
    }

    public remove(className: string) {
        className.split(' ').forEach(c => {
            this.element.classList.remove(c);
        });
    }

    public toggle(className: string) {
        className.split(' ').forEach(c => {
            this.element.classList.toggle(c);
        });
    }

}