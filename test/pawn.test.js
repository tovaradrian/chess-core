const Pawn = require('../models/pawn.model');
const board = require('../controllers/board.controller');
const PIECE_COLORS = require('../data/pieceColors');

describe('Pawn - En Passant', () => {
    const pawn = new Pawn({
        id: 'pawnA2',
        color: PIECE_COLORS.LIGHT,
        captured: false,
        position: {x: 1, y: 5},
        board,
    });

    const opponentPawn = new Pawn({
        id: 'pawnB7',
        color: PIECE_COLORS.DARK,
        captured: false,
        position: {x: 2, y: 7},
        board,
    });

    //Load pieces to the board
    board.pieces = [pawn, opponentPawn];
    //Move opponent pawn 2 slots to the front
    board.movePiece(opponentPawn, [2, 5]);

    const {x, y} = pawn.position;
    const targetX = x + 1, targetY = y + 1;

    it('has available moves', () => {
        const availableMoves = pawn.availableMoves();
        expect(availableMoves).toEqual(expect.arrayContaining([[x, targetY], [targetX, targetY]]));
    })

    it('can do En Passant capture', () => {
        board.pieces = [pawn, opponentPawn];
        expect(pawn.canAttack(targetX, targetY)).toBeTruthy();
    })
})