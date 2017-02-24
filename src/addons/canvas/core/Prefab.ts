class Prefab {

    public components: PrefabComponent[] = [];

    public static load(object: Prefab): GameObject {
        let go = new GameObject;
        for (let comp of object.components) {
            go.addComponent(comp.component);
        }
        return go;
    }

    public static save(object: GameObject): Prefab {
        let prefab = new Prefab;
        for (let comp of object.components) {
            let pfc = new PrefabComponent;
            pfc.component = comp.constructor.prototype.constructor;
            prefab.components.push(pfc);
        }
        return prefab;
    }
}

class PrefabComponent {
    public component: ComponentType<Component>;
}