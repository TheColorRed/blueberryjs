namespace Canvas {
    export abstract class Behavior extends Component {

        public name: string = 'GameObject';
        public tag: string = '';

        protected _transform: Transform;

        public get transform(): Transform {
            return this.object['_transform'];
        }

        public get gameObject(): CanvasObject {
            return this.object;
        }

        public addComponent<T extends Component>(comp: ComponentType<T>): T {
            let added = super.addComponent(comp);
            added.constructor.bind(added);
            added.object = this.gameObject;
            return added;
        }

    }
}