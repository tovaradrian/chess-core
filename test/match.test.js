const match = require('../controllers/match.controller');
const board = require('../controllers/board.controller');

match.setBoard(board);

describe('Match test', () => {

    beforeEach(() => {
        match.reset();
        match.addPlayer({nickname: "Player 1", name: "player1"});
        match.addPlayer({nickname: "Player 2", name: "player2"});
        match.start();
    })

    it('is stalemate state', () => {
        const jsonState = '{"turn":{"name":"player1","nickname":"Player 1","socketId":"wt_qxPv59Zmib3W_AAAD","color":0,"inCheck":false},"players":[{"name":"player1","nickname":"Player 1","socketId":"wt_qxPv59Zmib3W_AAAD","color":0,"inCheck":false},{"name":"player2","nickname":"Player 2","socketId":"eXZUO-tkqWWFE1tcAAAB","color":1,"inCheck":false}],"pieces":[{"id":"pawnA2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":1,"y":4},"captured":false},{"id":"pawnA7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"pawnB2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":1,"y":5},"captured":false},{"id":"pawnB7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":1,"y":6},"captured":false},{"id":"pawnC2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"pawnC7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":3,"y":6},"captured":false},{"id":"pawnD2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"pawnD7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"pawnE2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"pawnE7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"pawnF2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"pawnF7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"pawnG2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"pawnG7","type":{"name":"Queen"},"typeName":"queen","color":1,"position":{"x":6,"y":1},"captured":false},{"id":"pawnH2","type":{"name":"Pawn"},"typeName":"pawn","color":0,"position":{"x":8,"y":5},"captured":false},{"id":"pawnH7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":8,"y":7},"captured":false},{"id":"rookA1","type":{"name":"Rook"},"typeName":"rook","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"rookH1","type":{"name":"Rook"},"typeName":"rook","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"knightB1","type":{"name":"Knight"},"typeName":"knight","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"knightG1","type":{"name":"Knight"},"typeName":"knight","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"bishopC1","type":{"name":"Bishop"},"typeName":"bishop","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"bishopF1","type":{"name":"Bishop"},"typeName":"bishop","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"queenD1","type":{"name":"Queen"},"typeName":"queen","color":0,"position":{"x":0,"y":0},"captured":true},{"id":"kingE1","type":{"name":"King"},"typeName":"king","color":0,"position":{"x":8,"y":2},"captured":false},{"id":"rookA8","type":{"name":"Rook"},"typeName":"rook","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"rookH8","type":{"name":"Rook"},"typeName":"rook","color":1,"position":{"x":6,"y":8},"captured":false},{"id":"knightB8","type":{"name":"Knight"},"typeName":"knight","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"knightG8","type":{"name":"Knight"},"typeName":"knight","color":1,"position":{"x":4,"y":2},"captured":false},{"id":"bishopC8","type":{"name":"Bishop"},"typeName":"bishop","color":1,"position":{"x":0,"y":0},"captured":true},{"id":"bishopF8","type":{"name":"Bishop"},"typeName":"bishop","color":1,"position":{"x":8,"y":6},"captured":false},{"id":"queenD8","type":{"name":"Queen"},"typeName":"queen","color":1,"position":{"x":5,"y":3},"captured":false},{"id":"kingE8","type":{"name":"King"},"typeName":"king","color":1,"position":{"x":4,"y":6},"captured":false}],"lastMovement":{"piece":{"id":"pawnG7","type":{"name":"Pawn"},"typeName":"pawn","color":1,"position":{"x":6,"y":1},"captured":false},"previousPosition":[6,2],"position":[6,1]},"stateTimestamp":1663382840690}';
        match.setState(JSON.parse(jsonState));
        expect(match.isFinished()).toBeTruthy();
        expect(match.getWinner()).toBeNull();
    })

    it('is not stalemate state', () => {
        const pawnA2 = match.getBoard().getPieceById('pawnA2');
        const move1 = match.movePiece(pawnA2, [pawnA2.x, pawnA2.y + 1]);
        expect(move1).toBeTruthy();
        expect(match.isFinished()).toBeFalsy();
        expect(match.getWinner()).toBeNull();
    })
})