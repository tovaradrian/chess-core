const Match = require('../models/match.model');
const PIECE_COLORS = require('../data/pieceColors');
const PIECE_TYPES = require("../data/pieceTypes");

class MatchController {
    #model;

    constructor() {
        this.#model = new Match();
    }

    get model() {
        return this.#model;
    }

    setBoard(board) {
        this.model.setBoard(board);
    }

    start() {
        const turn = this.getTurn() || this.getLightPlayer();
        this.model.start(turn);
    }

    reset() {
        this.model.board.reset();
        this.#model = new Match(this.model.board);
    }

    inGame(player) {
        return this.model.inGame(player);
    }

    getLightPlayer() {
        return this.model.players.find(p => p.color === PIECE_COLORS.LIGHT);
    }

    getDarkPlayer() {
        return this.model.players.find(p => p.color === PIECE_COLORS.DARK);
    }

    nextTurn() {
        if (!this.model.hasRequiredPlayers()) return this.model.turn;
        this.model.turn = {...this.model.players.filter(p => p.name !== this.model.turn?.name)[0]};
        return this.model.turn;
    }

    movePiece(targetPiece, targetPosition) {
        if (!this.model.turn || targetPiece.color !== this.model.turn.color) return false;
        const {board} = this.model;
        if (board.canMove(targetPiece, targetPosition)) {
            board.movePiece(targetPiece, targetPosition);
            if (board.canPromote(targetPiece)) return true;
            if (!this.checkmateValidation()) this.nextTurn();
            return true;
        }
        return false;
    }

    checkmateValidation() {
        for (const piece of this.model.board.pieces) {
            const threat = piece.getThreat();
            if (piece.name === PIECE_TYPES.KING.name && threat !== null) {
                this.model.players.find(p => p.color === piece.color).inCheck = true;
                const {x, y} = piece.position;
                if (!piece.hasMoves() && !threat.canBeBlocked(x, y)) {
                    const winner = piece.color === PIECE_COLORS.DARK ? this.getLightPlayer() : this.getDarkPlayer();
                    this.finish(winner);
                    return true;
                }
                return false;
            }
        }
        const {inCheckPlayer} = this.model;
        if (inCheckPlayer) this.model.inCheckPlayer.inCheck = false;

        return false;
    }

    promotePawn(targetPiece, promoteTo) {
        if (!this.model.board.promotePawn(targetPiece, promoteTo)) return false;
        if (!this.checkmateValidation()) this.nextTurn();
        return true;
    }

    finish(winnerPlayer) {
        this.model.finish(winnerPlayer);
    }

    isStarted() {
        return this.model.started;
    }

    isFinished() {
        return this.model.finished;
    }

    getPlayers() {
        return this.model.players;
    }

    addPlayer(player) {
        return this.model.addPlayer(player);
    }

    hasRequiredPlayers() {
        return this.model.hasRequiredPlayers();
    }

    removePlayers() {
        return this.model.removePlayers();
    }

    updatePlayer(playerValue, playerData, playerKey = 'name') {
        return this.model.updatePlayer(playerValue, playerData, playerKey);
    }

    getTurn() {
        return this.model.turn;
    }

    getWinner() {
        return this.model.winner;
    }
}

module.exports = new MatchController();
