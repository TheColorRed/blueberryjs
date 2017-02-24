namespace Canvas {
    export class GameObject extends Behavior {

        public constructor() {
            super();
            this.id = Blueberry.uniqId();
            this.object = this;
            this._transform = this.addComponent(Transform);
            Blueberry.addElement(this);
        }
    }
}