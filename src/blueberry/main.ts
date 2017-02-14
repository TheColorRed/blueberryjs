window.addEventListener('DOMContentLoaded', event => {
    Blueberry.init();
    Blueberry.tick();
});
window.addEventListener('blur', function () {
    Blueberry['windowBlur']();
}, false);

window.addEventListener('focus', function () {
    Blueberry['windowFocus']();
}, false);

interface String {
    capitalizeFirstLetter();
}

interface Object {
    query(path: string, obj?);
}

interface Window {
    bb: Blueberry
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function serialize(obj, prefix?) {
    let str: string[] = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v)
            );
        }
    }
    return str.join("&");
}