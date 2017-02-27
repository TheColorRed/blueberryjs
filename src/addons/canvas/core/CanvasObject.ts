namespace Canvas {
    export class CanvasObject extends Behavior {

        public constructor() {
            super();
            this.id = Blueberry.uniqId();
            this.object = this;
            this._transform = this.addComponent(Transform);
            Blueberry.addElement(this);
        }
    }
}