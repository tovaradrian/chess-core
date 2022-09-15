const Piece = require('./piece.model');
const PIECE_TYPES = require('../data/pieceTypes');

class Bishop extends Piece {

  static points = 3;

  constructor({id, color, position, captured, board}) {
    const type = PIECE_TYPES.BISHOP;
    super({id, type, color, position, captured, board});
  }

  movementValidation(targetX, targetY) {
    const {x, y} = this.position;
    const xMove = Math.abs(x - targetX);
    const yMove = Math.abs(y - targetY);

    return xMove === yMove;
  }
}

module.exports = Bishop;