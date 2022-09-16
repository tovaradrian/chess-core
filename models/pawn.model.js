const Piece = require('./piece.model');
const PIECE_TYPES = require('../data/pieceTypes');
const PIECE_COLORS = require('../data/pieceColors');

class Pawn extends Piece {

    static points = 1;

    constructor({id, color, position, captured, board}) {
        const type = PIECE_TYPES.PAWN;
        super({id, type, color, position, captured, board});
    }

    canMove(x, y) {
        if (this.isEnPassantCapture(x, y)) return true;
        return super.canMove(x, y);
    }

    canAttack(x, y) {
        return this.isEnPassantCapture(x, y) || super.canAttack(x, y);
    }

    isEnPassantCapture(targetX, targetY) {
        if (!this.isAttackMovement(targetX, targetY) || this.board.hasPiece(targetX, targetY)) return false;
        const targetPiece = this.getEnPassantPawn(targetX, targetY);
        if (!targetPiece || !this.isOpponent(targetPiece) || targetPiece.name !== PIECE_TYPES.PAWN.name) return false;
        const {piece: lastMovedPiece, previousPosition, position} = this.board.getLastMovement();
        return lastMovedPiece?.id === targetPiece.id && Math.abs(previousPosition[1] - position[1]) === 2;
    }

    getEnPassantPawn(targetX, targetY) {
        const direction = !this.isDark() ? 1 : -1;
        return this.board.getPiece(targetX, targetY - direction);
    }

    isAttackMovement(targetX, targetY) {
        const {x, y} = this.position;
        const direction = !this.isDark() ? 1 : -1;
        return Math.abs(targetX - x) === 1 && (targetY - y) === direction;
    }

    isFirstMove() {
        const {y} = this.position;
        return y === 2 || y === this.board.size[1] - 1;
    }

    movementValidation(targetX, targetY) {
        const {x, y} = this.position;
        const direction = !this.isDark() ? 1 : -1;
        const xMove = !(x - targetX);
        const yMove = (targetY - y) === direction || (this.isFirstMove() && (targetY - y) === direction * 2);
        return xMove && yMove;
    }

    canPromote() {
        return (this.color === PIECE_COLORS.DARK && this.position.y === 1) || (this.color === PIECE_COLORS.LIGHT && this.position.y === 8);
    }
}

module.exports = Pawn;