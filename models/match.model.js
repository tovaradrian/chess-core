const REQUIRED_PLAYERS = 2;

class Match {
    #players = [];
    #turn = null;
    #started = false;
    #finished = false;
    #board = null;
    #winner = null;

    constructor(board) {
        this.#board = board;
    }

    get board() {
        return this.#board;
    }

    get players() {
        return this.#players;
    }

    set players(players) {
        this.#players = players;
    }

    get winner() {
        return this.#winner;
    }

    get inCheck() {
        return this.inCheckPlayer() !== undefined;
    }

    get inCheckPlayer() {
        return this.players.find(p => p.inCheck);
    }

    get turn() {
        return this.#turn;
    }

    set turn(player) {
        this.#turn = player;
    }

    get started() {
        return this.#started;
    }

    get finished() {
        return this.#finished;
    }

    start(player) {
        this.#turn = player;
        return this.#started = true;
    }

    setBoard(board) {
        this.#board = board;
    }

    addPlayer(player) {
        const existingPlayer = this.inGame(player);

        if (existingPlayer) {
            this.updatePlayer(player.name, player);
            return true;
        }

        if (this.hasRequiredPlayers()) return false;
        player = this.setPlayerColor(player);
        this.#players = [...this.#players.filter(p => p.name !== player.name), player];
        return true;
    }

    updatePlayer(playerValue, playerData, playerKey = 'name') {
        this.#players = this.#players.map(p => p[playerKey] === playerValue ? {...p, ...playerData} : p);
    }

    removePlayers() {
        this.#players = [];
    }

    inGame(player) {
        return this.#players.find(p => p.name === player.name);
    }

    hasRequiredPlayers() {
        return this.#players.length >= REQUIRED_PLAYERS;
    }

    setPlayerColor(player) {
        if (!this.#players.length) {
            player.color = Math.round(Math.random());
        } else {
            player.color = +!this.#players[0].color;
        }
        return player;
    }

    finish(winner) {
        this.#finished = true;
        this.#winner = winner;
        this.#turn = null;
    }
}

module.exports = Match;
