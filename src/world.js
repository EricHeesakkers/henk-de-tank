const axios = require("axios");
const { TANK_NAME, URL } = require("./config");
const Tank = require("./tank");

class World {
  constructor() {
    this.bounds = [1, 10];
  }

  async update() {
    const response = await axios.get(`${URL}/world`);
    return this.parse(response.data);
  }

  parse(response) {
    const tanks = response.tanks;

    const ownTankData = tanks.find(tank => tank.name === TANK_NAME);
    if (ownTankData) {
      if (!this.ownTank) {
        this.ownTank = new Tank(ownTankData.id);
      }
      Object.assign(this.ownTank, ownTankData);
    }

    this.tanks = tanks.filter(tank => tank.name !== TANK_NAME);
    this.obstacles = response.trees;
    return this.ownTank;
  }

  isInLineOfFire(sourceTank, targetX, targetY) {
    switch (sourceTank.orientation) {
      case "north":
        return (
          targetX === sourceTank.position[0] &&
          targetY < sourceTank.position[1]
        );
      case "east":
        return (
          targetX > sourceTank.position[0] &&
          targetY === sourceTank.position[1]
        );
      case "south":
        return (
          targetX === sourceTank.position[0] &&
          targetY > sourceTank.position[1]
        );
      case "west":
        return (
          targetX < sourceTank.position[0] &&
          targetY === sourceTank.position[1]
        );
    }
    return false;
  }

  hasTankInScope() {
    return this.tanks.some(targetTank => {
      return this.isInLineOfFire(this.ownTank, targetTank.position[0], targetTank.position[1]);
    });
  }

  isInLineOfFireOfOtherTanks() {
    return this.tanks.some(targetTank => {
      return this.isInLineOfFire(targetTank, this.ownTank.position[0], this.ownTank.position[1]);
    });
  }

  isPositionInLineOfFireOfOtherTanks(x, y) {
    return this.tanks.some(targetTank => {
      return this.isInLineOfFire(targetTank, x, y);
    });
  }

  // TODO, improve by parsing everything in a grid
  getAssetsAtLocation(x, y) {
    const assets = [this.ownTank, ...this.tanks, ...this.obstacles];

    return assets.filter(asset => (
      asset.position[0] === x && asset.position[1] === y
    ));
  }

  isCellAccessible(x, y) {
    const assets = this.getAssetsAtLocation(x, y);

    // Tank is blocked by an obstacle or tank
    if (assets.length > 0) {
      return false;
    }

    if (x > this.bounds[1] || y > this.bounds[1] || x < this.bounds[0] || y < this.bounds[0]) {
      return false;
    }

    return true;
  }

  getCoordinateRelativeToOwnTank(direction) {
    const [x, y] = this.ownTank.position;
    switch (direction) {
      case 'north':
          return [x, y -1];
      case 'east':
          return [x + 1, y];
      case 'south':
          return [x, y + 1];
      case 'west':
          return [x - 1, y];
    }
    throw new Error('Invalid direction');
  }

  getOpenNeighbours() {
    return ["north", "east", "south", "west"].filter(dir => {
      const [x, y] = this.getCoordinateRelativeToOwnTank(dir);

      return this.isCellAccessible(x, y) && !this.isPositionInLineOfFireOfOtherTanks(x, y);
    }
    );
  }

  hasTankInRange() {}

  isInCorner() {
    const horizontal =
      this.ownTank.position[0] === this.bounds[0] ||
      this.ownTank.position[0] === this.bounds[1];
    const vertical =
      this.ownTank.position[1] === this.bounds[0] ||
      this.ownTank.position[1] === this.bounds[1];

    console.log("IsInCorner", this.ownTank.position, horizontal, vertical);

    return horizontal && vertical;
  }

  // moveTowardsFirstPlayer() {
  //   if (this.tanks.length === 0) {
  //     return this.moveRandomly();
  //   }
  //   const firstPlayer = this.tanks[0];
  // }

  getDirectionToNearestCorner() {
    const x = this.ownTank.position[0];
    const y = this.ownTank.position[1];

    const northDiff = y - this.bounds[0];
    const westDiff = x - this.bounds[0];

    const southDiff = this.bounds[1] - y;
    const eastDiff = this.bounds[1] - x;

    if (northDiff <= southDiff && northDiff !== 0) {
      return "north";
    }
    if (southDiff < northDiff && southDiff !== 0) {
      return "south";
    }
    if (eastDiff <= westDiff && eastDiff !== 0) {
      return "east";
    }
    return "west";
  }
}

module.exports = World;
