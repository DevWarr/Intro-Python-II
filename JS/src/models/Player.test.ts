import { Inventory } from "./Inventory";
import { Player } from "./Player";
import { PositionVector2 } from "./PositionVector2";

jest.mock("./Inventory");

describe("Moving", () => {
  const STARTING_POINT = new PositionVector2(2, 2);
  let player: Player;
  let mockInventory: Inventory;

  beforeEach(() => {
    mockInventory = {} as unknown as Inventory;
    player = new Player("testPlayer", mockInventory, STARTING_POINT);
  });

  [
    {
      directionToMoveString: "LEFT",
      directionToMove: PositionVector2.LEFT,
      newPosition: STARTING_POINT.add(PositionVector2.LEFT),
    },
    {
      directionToMoveString: "RIGHT",
      directionToMove: PositionVector2.RIGHT,
      newPosition: STARTING_POINT.add(PositionVector2.RIGHT),
    },
    {
      directionToMoveString: "UP",
      directionToMove: PositionVector2.UP,
      newPosition: STARTING_POINT.add(PositionVector2.UP),
    },
    {
      directionToMoveString: "DOWN",
      directionToMove: PositionVector2.DOWN,
      newPosition: STARTING_POINT.add(PositionVector2.DOWN),
    },
  ].forEach(({ directionToMoveString, directionToMove, newPosition }) => {
    test(`Updates player direction when moving ${directionToMoveString}`, () => {
      player.move(directionToMove);

      expect(player.position.isEqualTo(newPosition)).toBe(true);
    });
  });
});

test("Running away sets the current position to the previous position", () => {
  const player = new Player("testPlayer");

  player.move(PositionVector2.LEFT);
  const expectedPositionAfterRunningAway = player.previousPosition;

  player.runAway();
  expect(player.position.isEqualTo(expectedPositionAfterRunningAway)).toBe(true);
});
