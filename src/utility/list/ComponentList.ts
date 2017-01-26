class ComponentList extends BlueberryObjectList<Component> {
    public set(key: string | Object, value?: any): this {
        return this.each(item => item.set(key, value));
    }
}