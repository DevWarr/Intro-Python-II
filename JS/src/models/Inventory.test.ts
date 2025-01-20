import { Inventory } from "./Inventory";
import { Item } from "./Item";

describe("Inventory", () => {
  let itemList: Item[];
  let fullInventory: Inventory;
  let emptyInventory: Inventory;

  beforeEach(() => {
    itemList = [
      new Item("test1", "desc1"),
      new Item("test2", "desc2"),
      new Item("test3", "desc3"),
      new Item("test4", "desc4"),
    ];

    fullInventory = new Inventory(itemList);
    emptyInventory = new Inventory();
  });

  test("isFull returns true when inventory is full", () => {
    expect(fullInventory.isFull).toBe(true);
  });

  test("isFull returns false when inventory is not full", () => {
    expect(emptyInventory.isFull).toBe(false);
  });

  test("inventoryNames property should return the names of all items in the inventory", () => {
    const expectedItemNames = itemList.map((item) => item.name);

    expect(fullInventory.inventoryNames).toStrictEqual(expectedItemNames);
  });

  test("inventoryNames property will return an empty list for an empty inventory", () => {
    expect(emptyInventory.inventoryNames).toStrictEqual([]);
  });

  test("removeFromInventory should return null if it doesn't exist in the inventory", () => {
    const expectedItemResponse = null;
    const itemNameToRemove = "notFound";

    const itemFromInventory = fullInventory.removeFromInventory(itemNameToRemove);

    expect(itemFromInventory).toEqual(expectedItemResponse);
  });

  test("removeFromInventory should return the item if it does exist in the inventory", () => {
    const expectedItemResponse = itemList[0];
    const itemNameToRemove = itemList[0].name;

    const itemFromInventory = fullInventory.removeFromInventory(itemNameToRemove);

    expect(itemFromInventory).toEqual(expectedItemResponse);
  });

  test("removeFromInventory should remove the item from the inventory if it does exist", () => {
    const itemNameToRemove = itemList[0].name;

    fullInventory.removeFromInventory(itemNameToRemove);

    expect(fullInventory.inventoryNames).not.toContain(itemNameToRemove);
  });

  [
    { testName: "should return true when the inventory has the item", expectedResponse: true, itemName: "test1" },
    {
      testName: "should return false when the inventory doesn't have the item",
      expectedResponse: false,
      itemName: "not found",
    },
  ].forEach(({ testName, expectedResponse, itemName }) => {
    test(`hasItem ${testName}`, () => {
      expect(fullInventory.hasItem(itemName)).toEqual(expectedResponse);
    });
  });

  test("addToInventory should return false if the inventory is at maximum size", () => {
    const itemToAdd = new Item("newItem", "desc");

    const successBoolean = fullInventory.addToInventory(itemToAdd);

    expect(successBoolean).toBe(false);
  });

  test("addToInventory should return true if the item is able to be added to the inventory", () => {
    const itemToAdd = new Item("newItem", "desc");

    const successBoolean = emptyInventory.addToInventory(itemToAdd);

    expect(successBoolean).toBe(true);
  });

  test("addToInventory should add the item to the inventory if possible", () => {
    const itemToAdd = new Item("newItem", "desc");

    emptyInventory.addToInventory(itemToAdd);

    expect(emptyInventory.inventoryNames).toContain(itemToAdd.name);
  });
});
