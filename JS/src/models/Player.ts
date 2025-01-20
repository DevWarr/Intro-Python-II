import { Item } from "./Item";
import { Room, Shrine } from "./Room";
import { GameMap } from "./GameMap";
import { PositionVector2 } from "./PositionVector2";

const ENTRANCE_ROOM: PositionVector2 = new PositionVector2(1, 4);

export class Player {
  constructor(
    public name: string,
    public gameMap: GameMap = new GameMap(),
    private __inventory: Item[] = [],
    private __position: PositionVector2 = ENTRANCE_ROOM,
    private __previousPosition: PositionVector2 = this.__position,
    private __maxInv: number = 4,
  ) {}

  get x() {
    return this.__position.x;
  }

  get y() {
    return this.__position.y;
  }

  /** Returns a copy of the player's position */
  get position() {
    return PositionVector2.fromSerializedPosition(this.__position.serializedPosition);
  }

  /** Returns a copy of the player's previous position */
  get previousPosition() {
    return PositionVector2.fromSerializedPosition(this.__previousPosition.serializedPosition);
  }

  /**
   * Returns the Room object the player is currently in
   *
   * Will throw an error if the player is in an invalid room.
   */
  get currentRoom(): Room {
    return this.gameMap.map[this.y][this.x]!;
  }

  /** Returns a copy of the player's inventory */
  get invenvtory() {
    return [...this.__inventory];
  }

  /**
   * Add's an item to the inventory.
   *
   * If the item would make the inventory too large,
   * returns false.
   *
   * Else, adds item and returns true.
   */
  addToInv(item: Item) {
    if (this.__inventory.length >= this.__maxInv) {
      return false;
    } else {
      this.__inventory.push(item);
      return true;
    }
  }

  /**
   * If possible, retrieves item from player inventory.
   * Casing does not matter.
   *
   * If the item is found, returns the item.
   *
   * Else, returns null.
   */
  getFromInv(name: string) {
    return this.__inventory.find((item) => item.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * If possible, removes item from player inventory.
   * Casing does not matter.
   *
   * If the item is found, removes the item
   * from the inventory and returns the item.
   *
   * Else, returns null.
   */
  removeFromInv(name: string) {
    const indexOfItem = this.__inventory.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
    if (indexOfItem > -1) {
      const [item] = this.__inventory.splice(indexOfItem, 1);
      return item;
    }
    return null;
  }

  /**
   * If possible,
   * Takes an item from the current room
   * And adds to the player inventory
   */
  takeItem(name: string) {
    const room = this.currentRoom;
    const item = room.removeFromInventory(name);

    if (item === null) {
      return [null, name];
    }
    const success = this.addToInv(item);

    if (!success) {
      // If we can't add the item to our inventory,
      //     (Inventory may be too large)
      // Then return the item to the room
      room.addToInventory(item);
      return [false, item.name];
    } else {
      return [true, item.name];
    }
  }

  /**
   * If possible,
   * Removes item from player inventory
   * And adds to current room.
   */
  dropItem(name: string) {
    const item = this.removeFromInv(name);
    if (item === null) {
      return [null, name];
    } else {
      const room = this.currentRoom;
      room.addToInventory(item);
      return [true, item.name];
    }
  }

  /**
   * Uses an item in the Player's inventory.
   *
   * Only used to end the game.
   * The item must be the Artifact,
   * and the player must be in the Entrance Room.
   *
   * If:
   * - Player doesn't have item → (null, name)
   * - Above conditions are met → (true, item.name).
   * - Else                     → (false, item.name).
   */
  useItem(name: string) {
    const item = this.getFromInv(name);
    if (!item) {
      return [null, name];
    }
    if (item.name === "Artifact" && this.y === ENTRANCE_ROOM.y && this.x === ENTRANCE_ROOM.x) {
      return [true, item.name];
    } else {
      return [false, item.name];
    }
  }

  /**
   * Confirms that our new direction is both
   *  -   in range
   *  -   A valid room
   * This could be done all in one if statement,
   * But the y, x, and valid room checks are
   *  separated for readability.
   */
  _confirmDirection(y: number, x: number) {
    if (this.gameMap.map[y]) {
      return !!this.gameMap.map[y][x];
    }
  }

  /**
   * Confirming each direction and making sure we stay in bounds,
   * moves a direction and stores previous location.
   *
   * Returns true if we moved, and false otherwise
   */
  move(direction: "n" | "s" | "w" | "e") {
    if (direction === "n" && this._confirmDirection(this.y - 1, this.x)) {
      this.__previousPosition = this.__position;
      this.__position = this.__position.add(PositionVector2.UP);
      return true;
    } else if (direction === "s" && this._confirmDirection(this.y + 1, this.x)) {
      this.__previousPosition = this.__position;
      this.__position = this.__position.add(PositionVector2.DOWN);
      return true;
    } else if (direction === "w" && this._confirmDirection(this.y, this.x - 1)) {
      this.__previousPosition = this.__position;
      this.__position = this.__position.add(PositionVector2.LEFT);
      return true;
    } else if (direction === "e" && this._confirmDirection(this.y, this.x + 1)) {
      this.__previousPosition = this.__position;
      this.__position = this.__position.add(PositionVector2.RIGHT);
      return true;
    } else {
      return false;
    }
  }

  runAway() {
    this.__position = this.__previousPosition;
  }

  /**
   * Checks if a guardian is in the current room.
   *
   * If there is a guardian, returns the guardian.
   * Else, returns null.
   */
  checkForGuardian() {
    if (this.currentRoom instanceof Shrine) {
      return this.currentRoom.guardian;
    }
  }
}

export class GamePlayer extends Player {
  constructor(name: string, gameMap: GameMap = new GameMap()) {
    super(name, gameMap, [new Item("Calculator", "Simple Calculator. Can add and subtract.")]);
  }
}

export class DebugPlayer extends Player {
  constructor(name: string) {
    const inventory = [
      new Item("Calculator", "Simple Calculator. Can add and subtract."),
      new Item("Artifact", "Simple Calculator. Can add and subtract."),
    ];
    super(name, new GameMap(), inventory);
  }
}
