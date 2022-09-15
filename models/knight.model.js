const Piece = require('./piece.model');
const PIECE_TYPES = require('../data/pieceTypes');

class Knight extends Piece {

    static points = 3;

    constructor({id, color, position, captured, board}) {
        const type = PIECE_TYPES.KNIGHT;
        super({id, type, color, position, captured, board});
    }

    hasObstacles(x, y) {
        return false;
    }

    movementValidation(targetX, targetY) {
        const {x, y} = this.position;
        const xMove = Math.abs(x - targetX);
        const yMove = Math.abs(y - targetY);

        return (xMove === 1 && yMove === 2) || (xMove === 2 && yMove === 1);
    }
}

module.exports = Knight;