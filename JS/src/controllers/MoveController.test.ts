import { GameMap } from "../models/GameMap";
import { Player } from "../models/Player";
import { PositionVector2 } from "../models/PositionVector2";
import { Room } from "../models/Room";
import { MoveController, NO_ROOM_ERROR_MESSAGE } from "./MoveController";

describe("MoveController", () => {
  let moveController: MoveController;
  let mockGameMap: GameMap;
  let mockPlayer: Player;

  beforeEach(() => {
    jest.resetAllMocks();
    mockGameMap = {
      getRoomAtPosition: jest.fn(),
    } as unknown as GameMap;
    mockPlayer = {
      position: {
        add: jest.fn(),
      },
      move: jest.fn(),
    } as unknown as Player;
    moveController = new MoveController();
  });

  it("should return a validation response if there is no room in the direction to move", () => {
    (mockGameMap.getRoomAtPosition as jest.Mock).mockReturnValue(null);

    const response = moveController.movePlayer(PositionVector2.UP, mockGameMap, mockPlayer);

    expect(response.actionSuccess).toBe(false);
    expect(response.responseToPlayer).toBe(NO_ROOM_ERROR_MESSAGE);
  });

  it("should move the player and return a successful action if there is a room in the direction to move", () => {
    (mockGameMap.getRoomAtPosition as jest.Mock).mockReturnValue({} as Room);

    const response = moveController.movePlayer(PositionVector2.UP, mockGameMap, mockPlayer);

    expect(mockPlayer.move).toHaveBeenCalledTimes(1);
    expect(response.actionSuccess).toBe(true);
  });
});
