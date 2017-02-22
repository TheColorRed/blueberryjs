/// <reference path="../../dist/blueberry.d.ts"/>

// Registers the clock component to Blueberry for usage
Blueberry.register(
    class Observe extends Component {
        observe() {
            return {
                first: 'John',
                last: 'Doe',
                get name() {
                    return this.first + ' ' + this.last;
                },
                set name(value) {
                    let name = value.split(' ', 2);
                    this.first = name[0] || '';
                    this.last = name[1] || '';
                }
            }
        }
    }
);


/**
 * @param {string} SDK
 */
let item = function (SDK) {

}

item()