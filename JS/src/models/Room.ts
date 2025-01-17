import { Item } from "./Item";
import { Guardian } from "./Guardians";

export class Room {
  constructor(
    public name: string,
    public description: string,
    public inventory: Item[] = [],
  ) {}

  /**
   * If possible, removes item from room.
   * Casing does not matter.
   */
  removeFromInventory(name: string): null | Item {
    let item = null;
    const itemIndex = this.inventory.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
    if (itemIndex > -1) {
      item = this.inventory[itemIndex];
      this.inventory.splice(itemIndex, 1);
    }
    return item;
  }

  addToInventory(item: Item) {
    this.inventory.push(item);
  }
}

export class Shrine extends Room {
  private __guardian: Guardian | null;

  constructor(name: string, description: string, inventory: Item[] = [], guardian: Guardian | null = null) {
    super(name, description, inventory);
    this.__guardian = guardian;
    if (this.__guardian != null) {
      this.__guardian.shrine = this;
    }
  }

  get guardian() {
    return this.__guardian;
  }

  set guardian(guardian) {
    if (guardian) {
      guardian.shrine = this;
    }
    this.__guardian = guardian;
  }
}

export const debugRoom = new Room(
  "You're an explorer, you see!",
  "Search through the Mathematical Caves, find the Artifact, and make your escape!",
  [new Item("Please resize"), new Item("So you can see"), new Item("All of"), new Item("This text")],
);
