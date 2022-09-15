class Player {
  #name = '';
  #color = '';
  #me = false;

  constructor(player) {
    this.#name = player.name;
    this.#color = player.color;
    this.#me = player.me || false;
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get itsMe() {
    return this.#me;
  }

}

module.exports = Player;