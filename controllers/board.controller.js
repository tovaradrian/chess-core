const Slot = require('../models/slot.model');
const Bishop = require('../models/bishop.model');
const King = require('../models/king.model');
const Knight = require('../models/knight.model');
const Pawn = require('../models/pawn.model');
const Queen = require('../models/queen.model');
const Rook = require('../models/rook.model');
const Board = require('../models/board.model');
const PIECE_COLORS = require('../data/pieceColors');
const PIECE_TYPES = require('../data/pieceTypes');

class BoardController {
    #model;

    constructor(pieces, reversed = false) {
        this.#model = new Board(reversed);
        this.setInitialPieces(pieces);
    }

    get model() {
        return this.#model;
    }

    set pieces(pieces) {
        this.updateSlots(pieces);
    }

    get pieces() {
        return this.model.pieces;
    }

    get slots() {
        return this.model.slots;
    }

    get size() {
        return this.model.size;
    }

    reverse(value = true) {
        this.model.reverse(value);
    }

    reversed() {
        return this.model.reversed;
    }

    reset() {
        this.#model = new Board(this.model.reversed);
        this.setInitialPieces();
    }

    updateSlots(pieces) {
        const slots = new Map();

        let startWithDarkColor = false;
        let slotIsDark = false;

        for (const y of this.model.rows) {
            slotIsDark = startWithDarkColor = !startWithDarkColor;

            for (const x of this.model.columns) {
                slots.set(`${x}_${y}`, new Slot({
                    position: {x, y},
                    isDark: slotIsDark,
                    piece: pieces.find(p => p.position.x === x && p.position.y === y),
                }));
                slotIsDark = !slotIsDark;
            }
        }

        this.model.pieces = pieces;
        this.model.slots = slots;
        return slots;
    }

    setInitialPieces(pieces = []) {
        if (pieces.length) {
            this.pieces = pieces;
            return;
        }

        //Load the pawns
        for (const x of this.model.columns) {
            pieces.push(new Pawn({
                id: `pawn${this.model.numberToLetter(x)}2`, color: PIECE_COLORS.LIGHT, position: {x, y: 2}, board: this,
            }), new Pawn({
                id: `pawn${this.model.numberToLetter(x)}7`,
                color: PIECE_COLORS.DARK,
                position: {x, y: this.model.size[1] - 1},
                board: this,
            }));
        }

        //Load the rest of the pieces
        for (let y of [1, this.model.size[1]]) {
            const pieceColor = y === 1 ? PIECE_COLORS.LIGHT : PIECE_COLORS.DARK;
            pieces.push(new Rook({
                id: `rookA${y}`, color: pieceColor, position: {x: 1, y}, board: this,
            }), new Rook({
                id: `rookH${y}`, color: pieceColor, position: {x: 8, y}, board: this,
            }), new Knight({
                id: `knightB${y}`, color: pieceColor, position: {x: 2, y}, board: this,
            }), new Knight({
                id: `knightG${y}`, color: pieceColor, position: {x: 7, y}, board: this,
            }), new Bishop({
                id: `bishopC${y}`, color: pieceColor, position: {x: 3, y}, board: this,
            }), new Bishop({
                id: `bishopF${y}`, color: pieceColor, position: {x: 6, y}, board: this,
            }), new Queen({
                id: `queenD${y}`, color: pieceColor, position: {x: 4, y}, board: this,
            }), new King({
                id: `kingE${y}`, color: pieceColor, position: {x: 5, y}, board: this,
            }));
        }

        //pieces.map(p => ![PIECE_TYPES.KING, PIECE_TYPES.ROOK].includes(p.type) && p.capture());
        this.pieces = pieces;
    }

    canMove(piece, targetPosition) {
        const targetPiece = this.model.pieces.find(p => p.id === piece.id);
        const [x, y] = targetPosition;
        if (!targetPiece) return false;
        return targetPiece.canMove(x, y);
    }

    movePiece(piece, targetPosition) {
        const targetPiece = this.model.pieces.find(p => p.id === piece.id);
        if (!targetPiece) return false;
        const [targetX, targetY] = targetPosition;
        const targetSlot = this.model.slots.get(`${targetX}_${targetY}`);
        let capturedPiece = null;

        if (targetSlot.piece) {
            capturedPiece = targetSlot.piece;
            targetSlot.piece.capture();
        }

        let castlingRook;
        if (targetPiece.name === PIECE_TYPES.KING.name && targetPiece.isCastling(targetX, targetY)) {
            castlingRook = targetPiece.getCastlingRook(targetX, targetY);
        }

        let enPassantPawn
        if (targetPiece.name === PIECE_TYPES.PAWN.name && targetPiece.isEnPassantCapture(targetX, targetY)) {
            enPassantPawn = targetPiece.getEnPassantPawn(targetX, targetY);
        }

        this.pieces = this.model.pieces.map(piece => {
            if (piece.id === targetPiece.id) {
                piece.move(targetX, targetY);
            } else if (castlingRook && piece.id === castlingRook.id) {
                piece.move(...targetPiece.getCastlingRookPosition(targetX, targetY));
            } else if (enPassantPawn && piece.id === enPassantPawn.id) {
                capturedPiece = piece;
                piece.capture();
            }
            return piece;
        });

        this.model.lastMovement = {
            piece: targetPiece,
            previousPosition: [targetPiece.position.x, targetPiece.position.y],
            position: [...targetPosition],
            capture: capturedPiece,
        };
    }

    getLastMovement() {
        return this.model.lastMovement;
    }

    canPromote(targetPiece) {
        const piece = this.getPieceById(targetPiece.id);
        if (!piece) return false;
        return piece.canPromote();
    }

    promotePawn(targetPiece, promoteTo) {
        const pawn = this.getPieceById(targetPiece.id);
        if (!pawn.canPromote) return false;

        const promotions = {
            bishop: Bishop,
            knight: Knight,
            rook: Rook,
            queen: Queen,
        };

        const PiecePromotionModel = promotions[promoteTo.toLowerCase()];
        if (!PiecePromotionModel) return false;

        this.pieces = this.model.pieces.map(piece => {
            if (piece.id === pawn.id) {
                piece = new PiecePromotionModel({...pawn.getGenericObject(), board: this});
            }
            return piece;
        });

        return true;
    }

    getAfterMoveState(targetPiece, targetPosition) {
        const pieces = [];
        const [targetX, targetY] = targetPosition;
        for (const piece of this.model.pieces) {
            if (piece.captured) continue;
            const statePiece = piece.duplicate();
            if (statePiece.position.x === targetX && statePiece.position.y === targetY) {
                statePiece.capture();
            }
            if (targetPiece.id === statePiece.id) statePiece.move(targetX, targetY);
            pieces.push(statePiece);
        }

        return new BoardController(pieces, this.reversed);
    }

    getSlot(x, y) {
        return this.model.slots.get(`${x}_${y}`);
    }

    getPiece(x, y) {
        return this.getSlot(x, y)?.piece;
    }

    getPieceById(pieceId) {
        return this.model.pieces.find(p => p.id === pieceId);
    }

    hasPiece(x, y) {
        return !!this.getPiece(x, y);
    }

    createPiece(piece, board = null) {
        if (!board) board = this;
        const pieceData = {...piece, board};
        switch (piece.typeName) {
            case "bishop":
                return new Bishop(pieceData);
            case "king":
                return new King(pieceData);
            case "knight":
                return new Knight(pieceData);
            case "pawn":
                return new Pawn(pieceData);
            case "queen":
                return new Queen(pieceData);
            case "rook":
                return new Rook(pieceData);
            default:
                return null;
        }
    }
}

module.exports = new BoardController();