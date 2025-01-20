import { Item } from "./Item";
import { Guardian } from "./Guardians";

export enum RoomType {
  EMPTY = "   ",
  TUNNEL = "[ ]",
  ENTRANCE = "[X]",
  SHRINE = "[S]",
  ARTIFACT = "[A]",
}

export class Room {
  constructor(
    private __name: string,
    private __description: string,
    private __roomType: RoomType,
    private __inventory: Item[] = [],
  ) {}

  get name() {
    return this.__name;
  }

  get description() {
    return this.__description;
  }

  get roomType() {
    return this.__roomType;
  }

  /**
   * Returns a copy of the room's inventory.
   *
   * THIS IS NOT MEANT TO BE USED FOR ANY ROOM MODIFICATON. Only meant for rendering info.
   */
  get inventory() {
    return [...this.__inventory];
  }

  /**
   * If possible, removes item from room.
   * Casing does not matter.
   */
  removeFromInventory(name: string): null | Item {
    let item = null;
    const itemIndex = this.__inventory.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
    if (itemIndex > -1) {
      item = this.__inventory[itemIndex];
      this.__inventory.splice(itemIndex, 1);
    }
    return item;
  }

  addToInventory(item: Item) {
    this.__inventory.push(item);
  }
}

export class Shrine extends Room {
  private __guardian: Guardian | null;

  constructor(name: string, description: string, guardian: Guardian, inventory: Item[] = []) {
    super(name, description, RoomType.SHRINE, inventory);
    this.__guardian = guardian;
    guardian.shrine = this;
  }

  get guardian() {
    return this.__guardian;
  }

  /** Removes the guardian from the shrine (used when the guardian dies) */
  removeGuardian() {
    this.__guardian = null;
  }
}

export const DEBUG_ROOM = new Room(
  "You're an explorer, you see!",
  "Search through the Mathematical Caves, find the Artifact, and make your escape!",
  RoomType.TUNNEL,
  [new Item("Please resize"), new Item("So you can see"), new Item("All of"), new Item("This text")],
);
