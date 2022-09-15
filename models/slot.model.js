class Slot {
  #position = {x: 0, y: 0};
  #isDark = false;
  #piece = null;

  constructor({position: {x, y}, isDark, piece = null}) {
    this.#position = {x, y};
    this.#isDark = !!isDark;
    this.#piece = piece;
  }

  get x() { return this.#position.x; }

  get y() { return this.#position.y; }

  get isDark() { return this.#isDark; }

  get piece() {return this.#piece;}

  set piece(piece) {
    this.#piece = piece;
  }

  removePiece() {
    this.#piece = null;
  }
}

module.exports = Slot;