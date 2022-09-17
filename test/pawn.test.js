const board = require('../controllers/board.controller');

describe('Pawn - En Passant', () => {
    const pawn = board.getPieceById('pawnA2');
    const opponentPawnB7 = board.getPieceById('pawnB7');
    const opponentPawnH7 = board.getPieceById('pawnH7');

    board.movePiece(pawn, [pawn.x, pawn.y + 2]);
    board.movePiece(opponentPawnH7, [opponentPawnH7.x, opponentPawnH7.y - 2]);
    board.movePiece(pawn, [pawn.x, pawn.y + 1]);
    board.movePiece(opponentPawnB7, [opponentPawnB7.x, opponentPawnB7.y - 2]);

    const {x, y} = pawn.position;
    const targetX = x + 1, targetY = y + 1;
    const targetPosition = [targetX, targetY];

    it('is in available moves', () => {
        const availableMoves = pawn.availableMoves();
        expect(availableMoves).toEqual(expect.arrayContaining([[x, targetY], [targetX, targetY]]));
    })

    it('can attack', () => {
        expect(pawn.canAttack(...targetPosition)).toBeTruthy();
    })

    it('can move', () => {
        expect(board.canMove(pawn, targetPosition)).toBeTruthy();
    })

    it('can capture', () => {
        board.movePiece(pawn, targetPosition);
        expect(pawn.position.x).toBe(targetX);
        expect(pawn.position.y).toBe(targetY);
        expect(opponentPawnB7.captured).toBeTruthy();
    })
})