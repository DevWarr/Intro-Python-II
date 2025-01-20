import { Player } from "./Player";
import { Room, Shrine } from "./Room";
import { Item } from "./Item";
import { Guardian } from "./Guardians";
import { GameMap, DEBUG_MAP } from "./GameMap";
import { PositionVector2 } from "./PositionVector2";

test("Creating a Player sets the name, description, and inventory properly", () => {
  const expectedItem = new Item("testItem", "testDescription");
  const player = new Player("testPlayer", new GameMap(), [expectedItem]);

  expect(player.name).toMatch(/player/i);
  expect(player.gameMap).toBeInstanceOf(GameMap);
  expect(player.invenvtory).toContain(expectedItem);
  expect(player.x).toEqual(1);
  expect(player.y).toEqual(4);
  expect(player.currentRoom).toBeInstanceOf(Room);
});

describe("Adding an item to the inventory", () => {
  test(`Returns false if the inventory is full`, () => {
    const fullInventory = [new Item("", ""), new Item("", ""), new Item("", ""), new Item("", "")];

    const player = new Player("testPlayer", new GameMap(), fullInventory);
    const success = player.addToInv(new Item("", ""));

    expect(success).toEqual(false);
  });

  test(`Returns true and adds to the inventory if the inventory is not full`, () => {
    const inventory = [new Item("", ""), new Item("", "")];
    const itemToAdd = new Item("newItem");

    const player = new Player("testPlayer", new GameMap(), inventory);
    const success = player.addToInv(itemToAdd);

    expect(success).toEqual(true);
    expect(player.invenvtory).toContain(itemToAdd);
  });
});

describe("Removing an item from the inventory", () => {
  test("Succesfully removes the item and returns true if the item is in the inventory", () => {
    const itemToRemove = new Item("testItem");
    const player = new Player("testPlayer", new GameMap(), [itemToRemove]);

    expect(player.invenvtory).toHaveLength(1);
    const itemOrNull = player.removeFromInv("testitem");

    expect(itemOrNull).toBe(itemToRemove);
    expect(player.invenvtory).toHaveLength(0);
  });

  test("Returns null if the item is not found in the inventory", () => {
    const player = new Player("testPlayer", new GameMap(), [new Item("testItem")]);

    expect(player.invenvtory).toHaveLength(1);
    const itemOrNull = player.removeFromInv("noitemlikethis");

    expect(itemOrNull).toEqual(null);
    expect(player.invenvtory).toHaveLength(1);
  });
});

describe("Taking an Item from the room", () => {
  test("Fails if the item is not found in the room", () => {
    const player = new Player("testPlayer", new GameMap());
    player.currentRoom.removeFromInventory = jest.fn(() => null);

    expect(player.invenvtory).toHaveLength(0);
    const [success] = player.takeItem("item");

    expect(player.currentRoom.removeFromInventory).toHaveBeenCalled();
    expect(success).toEqual(null);
    expect(player.invenvtory).toHaveLength(0);
  });

  test("Fails if the player inventory is too full", () => {
    const itemToTake = new Item("takeMa");

    const fullInventory = [new Item(""), new Item(""), new Item(""), new Item("")];
    const player = new Player("testPlayer", new GameMap(), fullInventory);
    player.currentRoom.removeFromInventory = jest.fn(() => itemToTake);
    player.currentRoom.addToInventory = jest.fn();

    expect(player.invenvtory).toHaveLength(4);
    const [success, itemName] = player.takeItem(itemToTake.name);

    expect(player.currentRoom.removeFromInventory).toHaveBeenCalled();
    expect(player.currentRoom.addToInventory).toHaveBeenCalled();
    expect(itemName).toEqual(itemToTake.name);
    expect(success).toEqual(false);
    expect(player.invenvtory).toHaveLength(4);
  });

  test("Succeeds if item is in room and inventory has space", () => {
    const itemToTake = new Item("takeMa");

    const player = new Player("testPlayer", new GameMap());
    player.currentRoom.removeFromInventory = jest.fn(() => itemToTake);

    expect(player.invenvtory).toHaveLength(0);
    const [success, itemName] = player.takeItem(itemToTake.name);

    expect(player.currentRoom.removeFromInventory).toHaveBeenCalled();
    expect(itemName).toEqual(itemToTake.name);
    expect(success).toEqual(true);
    expect(player.invenvtory).toHaveLength(1);
    expect(player.invenvtory).toContain(itemToTake);
  });
});

describe("Dropping an item", () => {
  test("Fails if the item is not in the inventory", () => {
    const player = new Player("testPlayer", new GameMap(), [new Item("")]);

    expect(player.invenvtory).toHaveLength(1);
    const [success] = player.dropItem("dropma");

    expect(success).toEqual(null);
    expect(player.invenvtory).toHaveLength(1);
  });

  test("Succeeds if the item is in the inventory", () => {
    const itemToDrop = new Item("dropMa");
    const player = new Player("testPlayer", new GameMap(), [itemToDrop]);

    expect(player.invenvtory).toHaveLength(1);
    const [success] = player.dropItem("dropma");

    expect(success).toEqual(true);
    expect(player.invenvtory).toHaveLength(0);
    expect(player.invenvtory).not.toContain(itemToDrop);
    expect(player.currentRoom.inventory).toContain(itemToDrop);
  });
});

describe("Using an item", () => {
  test("Returns null if the item is not in the inventory", () => {
    const player = new Player("testPlayer", new GameMap(), [new Item("")]);

    const [success] = player.useItem("useMa");

    expect(success).toEqual(null);
  });

  test("Returns false if the item is not the Artifact used in the Entrance Room", () => {
    const player = new Player("testPlayer", new GameMap(), [new Item("notTheArtifact")]);

    const [success] = player.useItem("notTheArtifact");

    expect(success).toEqual(false);
  });
  test("Returns True if the Artifact is used in the Entrace Room", () => {
    const player = new Player("testPlayer", new GameMap(), [new Item("Artifact")]);

    const [success] = player.useItem("Artifact");

    expect(success).toEqual(true);
  });
});

describe("Moving", () => {
  const STARTING_POINT = new PositionVector2(2, 2);
  let player: Player;

  beforeEach(() => {
    player = new Player("testPlayer", new GameMap(DEBUG_MAP), [], STARTING_POINT);
  });

  [
    { direction: "n", expectedX: 2, expectedY: 1 },
    { direction: "s", expectedX: 2, expectedY: 3 },
    { direction: "e", expectedX: 3, expectedY: 2 },
    { direction: "w", expectedX: 1, expectedY: 2 },
  ].forEach(({ direction, expectedX, expectedY }) => {
    test(`succeeds when moving ${direction}`, () => {
      expect(player.x).toEqual(STARTING_POINT.x);
      expect(player.y).toEqual(STARTING_POINT.y);
      const success = player.move(direction as "n" | "s" | "w" | "e");

      expect(success).toEqual(true);
      expect(player.x).toEqual(expectedX);
      expect(player.y).toEqual(expectedY);
    });
  });

  test.each([
    { startingPoint: new PositionVector2(0, 0), directionToMove: "n" },
    { startingPoint: new PositionVector2(0, 0), directionToMove: "w" },
    { startingPoint: new PositionVector2(4, 4), directionToMove: "s" },
    { startingPoint: new PositionVector2(4, 4), directionToMove: "e" },
  ])("returns false if there is no room in a given direction", ({ startingPoint, directionToMove }) => {
    player = new Player("testPlayer", new GameMap(DEBUG_MAP), [], startingPoint);

    expect(player.move(directionToMove as "n" | "s" | "e" | "w")).toEqual(false);
  });
});

test("Running away sets the current position to the previous position", () => {
  const player = new Player("testPlayer", new GameMap(DEBUG_MAP));

  player.move("w");
  const expectedPositionAfterRunningAway = player.previousPosition;

  player.runAway();
  expect(player.position.isEqualTo(expectedPositionAfterRunningAway)).toBe(true);
});

describe("Checking for a Guardian", () => {
  test("Returns the guardian if the current room is a Shrine", () => {
    const shrinePosition = new PositionVector2(1, 3);
    const player = new Player("testPlayer", new GameMap(), [], shrinePosition);

    expect(player.currentRoom).toBeInstanceOf(Shrine);
    expect(player.checkForGuardian()).toBeInstanceOf(Guardian);
  });

  test("Returns nothing if the current room is not a Shrine", () => {
    const nonShrinePosition = new PositionVector2(1, 4);
    const player = new Player("testPlayer", new GameMap(), [], nonShrinePosition);

    expect(player.checkForGuardian()).toBe(undefined);
  });
});
