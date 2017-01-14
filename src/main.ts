window.addEventListener('DOMContentLoaded', event => {
    Blueberry.init();
    Blueberry.tick();
});

interface String {
    capitalizeFirstLetter();
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}