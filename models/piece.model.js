const PIECE_COLORS = require('../data/pieceColors');
const PIECE_TYPES = require('../data/pieceTypes');

class Piece {
    #id = '';
    #type = {};
    #color = 0;
    #position = {x: 0, y: 0};
    #captured = false;
    #board = null;
    #points = 0;
    #moved = false;

    constructor({id, type, color, position, captured, board = null}) {
        this.#id = id;
        this.#type = type;
        this.#color = color;
        this.#position = position;
        this.#board = board;
        if (captured) this.capture();
    }

    duplicate() {
        const {id, color, position, captured, board} = this;
        return new this.constructor({id, color, position, captured, board});
    }

    get id() {
        return this.#id;
    }

    get type() {
        return this.#type;
    }

    get name() {
        return this.#type.name;
    }

    get typeName() {
        return this.#type.name.toLowerCase();
    }

    get color() {
        return this.#color;
    }

    get position() {
        return this.#position;
    }

    get board() {
        return this.#board;
    }

    get points() {
        return this.#points;
    }

    get captured() {
        return this.#captured;
    }

    get moved() {
        return this.#moved;
    }

    isDark() {
        return this.color === PIECE_COLORS.DARK;
    }

    isInDanger(x, y, board) {
        return this.getThreat(x, y, board) !== null;
    }

    getThreat(x, y, board) {
        if (!x && !y) {
            x = this.position.x;
            y = this.position.y;
        }

        if (!board) board = this.board;

        for (const piece of board.pieces) {
            if (piece.captured || !this.isOpponent(piece)) continue;
            if (piece.canLurk(x, y, board)) return piece;
        }

        return null;
    }

    kingInDanger(x, y) {
        const boardState = this.board.getAfterMoveState(this, [x, y]);
        const king = boardState.pieces.find(p => p.name === PIECE_TYPES.KING.name && p.color === this.color);
        return king.isInDanger(null, null, boardState);
    }

    capture() {
        this.move(0, 0);
        this.#captured = true;
    }

    recover(x, y) {
        this.move(x, y);
        this.#captured = false;
    }

    isAttackMovement(x, y) {
        return this.movementValidation(x, y);
    }

    canAttack(x, y) {
        const targetPiece = this.board.getPiece(x, y);
        if (targetPiece && targetPiece.name === PIECE_TYPES.KING.name) return false;
        return this.isOpponent(targetPiece) && this.canLurk(x, y) && !this.kingInDanger(x, y);
    }

    canLurk(x, y, board) {
        if (!board) board = this.board;
        return this.isAttackMovement(x, y) && !this.hasObstacles(x, y, board);
    }

    move(x, y) {
        this.#position = {x, y};
        this.#moved = true;
    }

    movementValidation(x, y) {
        return true;
    }

    inBetweenCoords(cord1, cord2) {
        const min = Math.min(...[cord1, cord2]);
        const max = Math.max(...[cord1, cord2]);
        const length = max - min - 1;

        if (length < 1) return [];

        const offset = min + 1;
        const coords = Array.from({length}, (_, i) => i + offset);
        return cord1 > cord2 ? coords.reverse() : coords;
    }

    inBetweenColumnsAndRows(x, y) {
        const {x: currentX, y: currentY} = this.position;

        let columns = this.inBetweenCoords(currentX, x);
        let rows = this.inBetweenCoords(currentY, y);

        if (!columns.length && !rows.length) return {columns, rows};

        if (!columns.length) columns = [currentX];
        if (!rows.length) rows = [currentY];

        return {columns, rows}
    }

    inBetweenPositions(x, y) {
        const positions = [];
        const {columns, rows} = this.inBetweenColumnsAndRows(x, y);

        if (columns.length === rows.length) {
            let i = 0;
            for (const slotX of columns) {
                const slotY = rows[i++];
                positions.push([slotX, slotY]);
            }
            return positions;
        }

        for (const slotX of columns) {
            for (const slotY of rows) {
                positions.push([slotX, slotY]);
            }
        }
        return positions;
    }

    hasObstacles(x, y, board) {
        if (!board) board = this.board;
        const {columns, rows} = this.inBetweenColumnsAndRows(x, y);

        if (columns.length === rows.length) {
            let i = 0;
            for (const slotX of columns) {
                const slotY = rows[i++];
                if (board.hasPiece(slotX, slotY)) return true;
            }
            return false;
        }

        for (const slotX of columns) {
            for (const slotY of rows) {
                if (board.hasPiece(slotX, slotY)) return true;
            }
        }
        return false;
    }

    canMove(x, y) {
        if (this.board.hasPiece(x, y)) return this.canAttack(x, y);
        return this.movementValidation(x, y) && !this.hasObstacles(x, y) && !this.kingInDanger(x, y);
    }

    availableMoves() {
        const movements = [];
        this.board.slots.forEach(slot => {
            const {x, y} = slot;
            if (this.canMove(x, y)) movements.push([x, y])
        })
        return movements;
    }

    hasMoves() {
        return this.availableMoves().length > 0;
    }

    canBeBlocked(x, y) {
        for (const piece of this.board.pieces) {
            if (piece.captured || !this.isOpponent(piece)) continue;
            const {x: threatX, y: threatY} = this.position;
            if (piece.canLurk(threatX, threatY) && !piece.kingInDanger(threatX, threatY)) return true;
            if (piece.name === PIECE_TYPES.KING.name) continue;
            for (const [inBetweenX, inBetweenY] of this.inBetweenPositions(x, y)) {
                if (piece.canMove(inBetweenX, inBetweenY)) return true;
            }
        }

        return false;
    }

    isOpponent(piece) {
        if (!piece) return false;
        return piece.color !== this.color;
    }

    getGenericObject() {
        return {
            id: this.id,
            type: this.type,
            typeName: this.typeName,
            color: this.color,
            position: this.position,
            captured: this.captured,
        }
    }

    canPromote() {
        return false;
    }
}

module.exports = Piece;