import { ExplorationStateActionResponse } from "../GameStates/ExplorationState";
import { GameMap } from "../models/GameMap";
import { Player } from "../models/Player";
import { ValidDirection } from "../models/PositionVector2";

const NO_ROOM_ERROR_MESSAGE = "~rThere is no room in that direction.~e";

export class MoveController {
  public movePlayer(directionToMove: ValidDirection, gameMap: GameMap, player: Player): ExplorationStateActionResponse {
    // Check to see if there's a valid room at the new player position
    // If there isn't a room, return false since the room movement was unsuccessful
    const newPlayerPosition = player.position.add(directionToMove);
    if (gameMap.getRoomAtPosition(newPlayerPosition) === null) {
      return {
        actionSuccess: false,
        responseToPlayer: NO_ROOM_ERROR_MESSAGE,
      };
    } else {
      // If there is a room, move the player and return a successful action
      player.move(directionToMove);
      return {
        actionSuccess: true,
      };
    }
  }
}
