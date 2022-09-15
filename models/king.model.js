const Piece = require('./piece.model');
const PIECE_TYPES = require('../data/pieceTypes');

class King extends Piece {

    static points = 0;

    constructor({id, color, position, captured, board}) {
        const type = PIECE_TYPES.KING;
        super({id, type, color, position, captured, board});
    }

    movementValidation(targetX, targetY) {
        const {x, y} = this.position;
        const xMove = Math.abs(x - targetX);
        const yMove = Math.abs(y - targetY);
        return (xMove <= 1 && yMove <= 1) || this.isCastling(targetX, targetY);
    }

    isCastling(targetX, targetY) {
        if (this.moved) return false;
        const {x, y} = this.position;
        const xMove = Math.abs(x - targetX);
        if (targetY !== y || xMove !== 2) return false;
        const castlingRook = this.getCastlingRook(targetX, targetY);
        if (!castlingRook || castlingRook.moved) return false;
        return !this.hasObstacles(castlingRook.position.x, castlingRook.position.y) && !this.isInDanger();
    }

    getCastlingRook(targetX, targetY) {
        const {x} = this.position;
        const rookX = targetX < x ? 1 : 8;
        return this.board.getPiece(rookX, targetY);
    }

    getCastlingRookPosition(targetX, targetY) {
        const {x} = this.position;
        const direction = targetX < x ? 1 : -1;
        return [targetX + direction, targetY];
    }
}

module.exports = King;