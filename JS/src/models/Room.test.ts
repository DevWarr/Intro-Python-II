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
    const expectedInventoryLength = inventory.length - 1;
    const nameOfItemToRemove = "1";
    const returnedItem = testRoom.removeFromInventory(nameOfItemToRemove);

    expect(testRoom.inventory.length).toEqual(expectedInventoryLength);
    expect(returnedItem?.name).toEqual(nameOfItemToRemove);
  });

  test("Room returns null and removes nothing if the item is not found in inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", inventory);
    const expectedInventoryLength = inventory.length;
    const returnedItem = testRoom.removeFromInventory("17");

    expect(testRoom.inventory.length).toEqual(expectedInventoryLength);
    expect(returnedItem).toEqual(null);
  });

  test("Room successfully adds an item to inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", inventory);
    const expectedInventoryLength = inventory.length + 1;
    const newItemName = "4";
    testRoom.addToInventory(new Item(newItemName));

    expect(testRoom.inventory.length).toEqual(expectedInventoryLength);
    expect(testRoom.inventory[expectedInventoryLength - 1].name).toEqual(newItemName);
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
