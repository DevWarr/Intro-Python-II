import { Item } from "./Item";

export class Inventory {
  constructor(
    private inventory: Item[] = [],
    private maxInventorySize: number = 4,
  ) {}

  /**
   * Returns a list of the names of the items in the inventory.
   *
   * If you want to gain access to the item itself, you must remove it from the inventory.
   */
  get inventoryNames() {
    return this.inventory.map((item) => item.name);
  }

  /**
   * If possible, removes item from room.
   * Casing does not matter.
   *
   * NOTE: If there's not an item with the same name, this will return null!
   * Make sure to use hasItem first to check the room as the item.
   */
  public removeFromInventory(name: string): null | Item {
    let item = null;
    const itemIndex = this.inventory.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
    if (itemIndex > -1) {
      item = this.inventory[itemIndex];
      this.inventory.splice(itemIndex, 1);
    }
    return item;
  }

  public hasItem(itemName: string): boolean {
    return !!this.inventory.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
  }

  /**
   * Add's an item to the inventory.
   *
   * If the item would make the inventory too large,
   * returns false.
   *
   * Else, adds item and returns true.
   */
  public addToInventory(item: Item): boolean {
    if (this.inventory.length >= this.maxInventorySize) {
      return false;
    } else {
      this.inventory.push(item);
      return true;
    }
  }
}
