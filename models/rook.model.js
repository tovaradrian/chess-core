const Piece = require('./piece.model');
const PIECE_TYPES = require('../data/pieceTypes');

class Rook extends Piece {

  static points = 5;

  constructor({id, color, position, captured, board}) {
    const type = PIECE_TYPES.ROOK;
    super({id, type, color, position, captured, board});
  }

  movementValidation(targetX, targetY) {
    const {x, y} = this.position;
    const xMove = x - targetX;
    const yMove = y - targetY;

    return (!xMove && yMove) || (xMove && !yMove);
  }
}

module.exports = Rook;