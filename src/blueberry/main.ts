window.addEventListener('DOMContentLoaded', event => {
    Blueberry.init();
    Blueberry.tick();
});

interface String {
    capitalizeFirstLetter();
}

interface Object {
    copy();
    query(path: string, obj?);
}

interface Window {
    bb: Blueberry
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function copy(obj) {
    if (null == obj || 'object' != typeof obj) return obj;
    let copy = obj.constructor();
    for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function serialize(obj, prefix?) {
    let str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}