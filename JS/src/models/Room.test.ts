import { Item } from "./Item";
import { Room, RoomType } from "./Room";

describe("Room", () => {
  let inventory: Item[];

  beforeEach(() => {
    inventory = [new Item("1"), new Item("2"), new Item("3")];
  });

  test("Room creation has the proper name, description, and inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", RoomType.TUNNEL, inventory);

    expect(testRoom.name).toEqual("testRoom");
    expect(testRoom.description).toEqual("testDescription");
    expect(testRoom.inventory).toEqual(inventory);
  });

  test("Room successfully removes and returns item from inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", RoomType.TUNNEL, inventory);
    const expectedInventoryLength = inventory.length - 1;
    const nameOfItemToRemove = "1";
    const returnedItem = testRoom.removeFromInventory(nameOfItemToRemove);

    expect(testRoom.inventory.length).toEqual(expectedInventoryLength);
    expect(returnedItem?.name).toEqual(nameOfItemToRemove);
  });

  test("Room returns null and removes nothing if the item is not found in inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", RoomType.TUNNEL, inventory);
    const expectedInventoryLength = inventory.length;
    const returnedItem = testRoom.removeFromInventory("17");

    expect(testRoom.inventory.length).toEqual(expectedInventoryLength);
    expect(returnedItem).toEqual(null);
  });

  test("Room successfully adds an item to inventory", () => {
    const testRoom = new Room("testRoom", "testDescription", RoomType.TUNNEL, inventory);
    const expectedInventoryLength = inventory.length + 1;
    const newItemName = "4";
    testRoom.addToInventory(new Item(newItemName));

    expect(testRoom.inventory.length).toEqual(expectedInventoryLength);
    expect(testRoom.inventory[expectedInventoryLength - 1].name).toEqual(newItemName);
  });
});
