const axios = require("axios");
const { TANK_NAME, URL } = require("./config");
const World = require("./world");
const Strategy = require("./strategy");
const Tank = require("./tank");

class Controller {
  constructor() {
    this.world = new World();
    this.strategy = new Strategy();
    this.turnCount = 0;
    this.tank = null;
  }

  async tick() {
    console.log("---------- Turn " + this.turnCount);
    this.turnCount += 1;

    await this.world.update();

    if (!this.tank.orientation) {
      console.log("# Initial tick");
      return;
    }

    this.strategy.handleTurn(this.tank, this.world);

    setTimeout(() => {
      this.tick();
    }, 1000);
  }

  async bootstrap() {
    await this.world.update();
    if (this.world.ownTank) {
      this.tank = this.world.ownTank;
      console.log("Bootstrap, exists!", this.tank);
      return;
    }
    await this.subscribe();
    console.log("Boostrap, NOT exists", this.tank);
    return (this.world.ownTank = this.tank);
  }

  async subscribe() {
    const response = await axios.post(`${URL}/subscribe`, {
      name: TANK_NAME
    });

    const id = parseInt(response.data);
    this.tank = new Tank(id);
    return;
  }
}

module.exports = Controller;
