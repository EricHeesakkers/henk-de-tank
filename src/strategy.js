class Strategy {
  handleTurn(tank, world) {
    this.tank = tank;
    this.world = world;

    if (this.world.isInLineOfFireOfOtherTanks()) {
      this.moveRandomly();
      return;
    }

    if (this.world.hasTankInScope()) {
      this.tank.fire();
      return;
    }

    // if (!this.world.isInCorner()) {
    //   const direction = this.world.getDirectionToNearestCorner();
    //   console.log("Move in direction: ", direction);
    //   this.tank.move(direction);
    // } else {
    this.moveRandomly();
    // }
  }

  moveRandomly() {
    const directions = this.world.getOpenNeighbours();
    if (directions.length < 4) {
      console.log(`Blocked some way: At position ${this.tank.position[0]} ${this.tank.position[1]}`)
    }
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];

    this.tank.move(randomDirection);
  }
}

module.exports = Strategy;
