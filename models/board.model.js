class Board {
    #size = [];
    #columns = [];
    #rows = [];
    #reversed = false;
    #slots = new Map();
    #pieces = [];
    #lastMovement = null;

    constructor(reversed = false) {
        this.#size = [8, 8];
        this.#columns = Array.from({length: this.#size[0]}, (_, i) => i + 1);
        this.#rows = Array.from({length: this.#size[1]}, (_, i) => i + 1);
        this.#reversed = reversed;
    }

    get size() {
        return this.#size;
    }

    get columns() {
        return this.#reversed ? this.#columns.reverse() : this.#columns;
    }

    get columnLetters() {
        return this.columns.map(column => this.numberToLetter(column));
    }

    get rows() {
        return this.#reversed ? this.#rows.reverse() : this.#rows;
    }

    get slots() {
        return this.#slots;
    }

    set slots(slots) {
        this.#slots = slots;
    }

    get pieces() {
        return this.#pieces;
    }

    set pieces(pieces) {
        this.#pieces = pieces;
    }

    get lastMovement() {
        return this.#lastMovement;
    }

    set lastMovement(data) {
        this.#lastMovement = data;
    }

    reverse(value = true) {
        this.#reversed = value;
    }

    numberToLetter(number) {
        return String.fromCharCode(64 + number);
    }
}

module.exports = Board;