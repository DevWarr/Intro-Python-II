import { Item } from "./Item";
import { PositionVector2, ValidDirection } from "./PositionVector2";
import { Inventory } from "./Inventory";

const ENTRANCE_ROOM: PositionVector2 = new PositionVector2(1, 4);

export class Player {
  constructor(
    readonly name: string,
    readonly inventory: Inventory = new Inventory([]),
    private __position: PositionVector2 = ENTRANCE_ROOM,
    private __previousPosition: PositionVector2 = this.__position,
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
   * Moves the player in the specified direction.
   *
   * Updates the previous and the current position of the player.
   */
  move(directionToMove: ValidDirection) {
    this.__previousPosition = this.__position;
    this.__position = this.__position.add(directionToMove);
  }

  runAway() {
    this.__position = this.__previousPosition;
  }
}

export class GamePlayer extends Player {
  constructor(name: string) {
    super(name, new Inventory([new Item("Calculator", "Simple Calculator. Can add and subtract.")]));
  }
}

export class DebugPlayer extends Player {
  constructor(name: string) {
    const inventory = [
      new Item("Calculator", "Simple Calculator. Can add and subtract."),
      new Item("Artifact", "Simple Calculator. Can add and subtract."),
    ];
    super(name, new Inventory(inventory));
  }
}
