const Piece = require('./piece.model');
const PIECE_TYPES = require('../data/pieceTypes');

class Queen extends Piece {

  static points = 9;

  constructor({id, color, position, captured, board}) {
    const type = PIECE_TYPES.QUEEN;
    super({id, type, color, position, captured, board});
  }

  movementValidation(targetX, targetY) {
    const {x, y} = this.position;
    const xMove = Math.abs(x - targetX);
    const yMove = Math.abs(y - targetY);

    return (!xMove && yMove) || (xMove && !yMove) || xMove === yMove;
  }
}

module.exports = Queen;