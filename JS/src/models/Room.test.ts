import { Guardian } from "./Guardians";
import { Item } from "./Item";
import { Room, Shrine } from "./Room";

describe("Room", () => {
  let inventory: Item[];

  beforeEach(() => {
    inventory = [new Item("1"), new Item("2"), new Item("3")];
  });

  test("Room creation has the proper name, description, and inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", inventory);

    expect(testRoom.name).toEqual("testRoom");
    expect(testRoom.description).toEqual("testDescription");
    expect(testRoom.inventory).toEqual(inventory);
  });

  test("Room successfully removes and returns item from inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", inventory);
    const returnedItem = testRoom.removeFromInventory("4");

    expect(testRoom.inventory.length).toEqual(1);
    expect(testRoom.inventory[0].name).toEqual("1");
    expect(returnedItem?.name).toEqual("4");
  });

  test("Room returns null and removes nothing if the item is not found in inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", inventory);
    const returnedItem = testRoom.removeFromInventory("17");

    expect(testRoom.inventory.length).toEqual(2);
    expect(returnedItem).toEqual(null);
  });

  test("Room successfully adds an item to inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", inventory);
    testRoom.addToInventory(new Item("4"));
    const expectedInventoryIndex = 2;

    expect(testRoom.inventory.length).toEqual(3);
    expect(testRoom.inventory[expectedInventoryIndex].name).toEqual("2");
  });
});

describe("Shrine", () => {
  test("Creating a Shrine with a Guardian adds the Shrine to the Guardian's attributes", () => {
    const testGuardian = new Guardian("testGuardian", "testDescription");
    const testShrine = new Shrine("testShrine", "testDescription", [], testGuardian);

    expect(testShrine.guardian).toBe(testGuardian);
    expect(testGuardian.shrine).toBe(testShrine);
  });
  test("adding a Guardian to a Shrine adds the Shrine to the Guardian's attributes", () => {
    const testGuardian = new Guardian("testGuardian", "testDescription");
    const testShrine = new Shrine("testShrine", "testDescription", []);

    expect(testShrine.guardian).toBe(null);

    testShrine.guardian = testGuardian;

    expect(testShrine.guardian).toBe(testGuardian);
    expect(testGuardian.shrine).toBe(testShrine);
  });
});
