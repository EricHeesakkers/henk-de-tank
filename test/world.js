const worldFixture = require("./fixtures/world.json");
const World = require("../src/world");

describe("The world, when parsing", () => {
  let world = new World();
  beforeEach(() => {
    world.parse(worldFixture);
  });

  it("should parse enemyTanks in .tanks", () => {
    expect(world.tanks).toHaveLength(2);
    expect(world.tanks[0].name).toBe("Tank A");
    expect(world.tanks[0].position).toEqual([10, 7]);
    expect(world.tanks[0].orientation).toBe("north");
    expect(world.tanks[1].name).toBe("Tank B");
    expect(world.tanks[1].position).toEqual([6, 10]);
    expect(world.tanks[1].orientation).toBe("south");
  });

  it("should parse trees to obstacles", () => {
    expect(world.obstacles).toHaveLength(12);

    expect(world.obstacles.map(o => o.position)).toEqual([
      [6, 3],
      [3, 4],
      [7, 3],
      [7, 8],
      [5, 3],
      [4, 8],
      [5, 8],
      [8, 5],
      [6, 8],
      [3, 6],
      [3, 7],
      [3, 5]
    ]);
  });

  it('should be able to return assets at a location', () => {
    console.log('asset', world.ownTank)
    world.ownTank.position = [5, 5];

    expect(world.getAssetsAtLocation(5, 5)).toEqual([world.ownTank]);
  });

  describe('and listing open moves', () => {

    it('should not try to go out of bounds', () => {
      world.ownTank.position = [1, 1];
      expect(world.getOpenNeighbours()).toEqual(['east', 'south']);

      world.ownTank.position = [10, 10];
      expect(world.getOpenNeighbours()).toEqual(['north', 'west']);
    });

    it('should not bump into trees', () => {
      world.ownTank.position = [5, 5];
      world.obstacles = [{
        position: [4, 5],
      }];

      // const a = world.getOpenNeighbours();
      // console.log('a', a);

      expect(world.getOpenNeighbours()).toEqual(['north', 'east', 'south'])
    });

    it('should not move into a line of sight', () => {
      world.ownTank.position = [2, 2];
      world.obstacles = [];

      // This tank is targeting the position to the east of our tank
      world.tanks = [{
        orientation: 'north',
        position: [3, 3]
      }];

      expect(world.getOpenNeighbours()).toEqual(['north', 'south', 'west'])
    })
  });

  describe("should be able to check if a tank is in scope", () => {
    it("while pointing to the north", () => {
      world.ownTank.position = [5, 5];
      world.ownTank.orientation = "north";

      world.tanks = [
        {
          name: "aaa",
          position: [5, 10]
        }
      ];

      expect(world.hasTankInScope()).toBe(false);

      world.tanks[0].position[1] = 0;
      expect(world.hasTankInScope()).toBe(true);
    });

    it("while pointing to the east", () => {
      world.ownTank.position = [5, 5];
      world.ownTank.orientation = "east";

      world.tanks = [
        {
          name: "aaa",
          position: [0, 5]
        }
      ];

      expect(world.hasTankInScope()).toBe(false);

      world.tanks[0].position[0] = 10;
      expect(world.hasTankInScope()).toBe(true);
    });

    it("while pointing to the south", () => {
      world.ownTank.position = [5, 5];
      world.ownTank.orientation = "south";

      world.tanks = [
        {
          name: "aaa",
          position: [5, 0]
        }
      ];

      expect(world.hasTankInScope()).toBe(false);

      world.tanks[0].position[1] = 10;
      expect(world.hasTankInScope()).toBe(true);
    });

    it("while pointing to the west", () => {
      world.ownTank.position = [5, 5];
      world.ownTank.orientation = "west";

      world.tanks = [
        {
          name: "aaa",
          position: [10, 5]
        }
      ];

      expect(world.hasTankInScope()).toBe(false);

      world.tanks[0].position[0] = 0;
      expect(world.hasTankInScope()).toBe(true);
    });
  });
});
