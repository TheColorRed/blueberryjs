interface Addon {
    init?(): void;
    ready?(): void;
}

abstract class Addon extends Obj {

}