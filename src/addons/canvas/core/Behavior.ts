namespace Canvas {
    export abstract class Behavior extends Component {

        protected _transform: Transform;

        public get transform(): Transform {
            return this.object['_transform'];
        }

        public get gameObject(): GameObject {
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