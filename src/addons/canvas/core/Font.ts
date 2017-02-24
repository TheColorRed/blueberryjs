namespace Canvas.UI {
    export enum FontStyle { Regular, Bold, Italic, BoldItalic };

    export class Font {
        public color: Color = Color.black;
        public family: string = 'Arial';
        public size: number = 12;
        public units: string = 'pt';
        public style: FontStyle = FontStyle.Regular;

        /**
         * Get the font
         *
         * @returns
         *
         * @memberOf Font
         */
        public toString() {
            switch (this.style) {
                case FontStyle.Regular: return `${this.size}${this.units} ${this.family}`;
                case FontStyle.Bold: return `bold ${this.size}${this.units} ${this.family}`;
                case FontStyle.Italic: return `italic ${this.size}${this.units} ${this.family}`;
                case FontStyle.BoldItalic: return `bold italic ${this.size}${this.units} ${this.family}`;
            }
        }
    }
}