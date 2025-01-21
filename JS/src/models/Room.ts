import { Item } from "./Item";
import { Guardian } from "./Guardians";
import { Inventory } from "./Inventory";

export enum RoomType {
  EMPTY = "   ",
  TUNNEL = "[ ]",
  ENTRANCE = "[X]",
  SHRINE = "[S]",
  ARTIFACT = "[A]",
}

export class Room {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly roomType: RoomType,
    readonly inventory: Inventory = new Inventory([]),
  ) {}
}

export class Shrine extends Room {
  private __guardian: Guardian | null;

  constructor(guardian: Guardian, name: string, description: string, inventory: Inventory = new Inventory([])) {
    super(name, description, RoomType.SHRINE, inventory);

    this.__guardian = guardian;
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
  new Inventory([new Item("Please resize"), new Item("So you can see"), new Item("All of"), new Item("This text")]),
);
