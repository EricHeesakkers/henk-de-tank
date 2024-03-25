const axios = require("axios");
const { URL } = require("./config");

class Tank {
  constructor(id) {
    this.id = id;
  }

  async move(direction) {
    try {
      await axios.post(`${URL}/tank`, {
        tankid: this.id,
        command: direction
      });
    } catch (e) {
      console.log("Moving failed!", e);
    }
  }

  async fire() {
    try {
      return await axios.post(`${URL}/tank`, {
        tankid: this.id,
        command: "fire"
      });
    } catch (e) {
      console.log("Firing failed!", e);
    }
  }
}

module.exports = Tank;
