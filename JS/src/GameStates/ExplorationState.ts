import { MoveController } from "../controllers/MoveController";
import { GameMap } from "../models/GameMap";
import { Player } from "../models/Player";
import { PositionVector2 } from "../models/PositionVector2";
import { GameMapContainer } from "../views/GameMapContainer";
import { ResponseContainer } from "../views/ResponseContainer";
import { RoomInfoContainer } from "../views/RoomInfoContainer";

const MOVEMENT_DIRECTION_STRING_TO_VECTOR2: Record<string, PositionVector2> = {
  n: PositionVector2.UP,
  s: PositionVector2.DOWN,
  w: PositionVector2.LEFT,
  e: PositionVector2.RIGHT,
};

export class ExplorationState {
  constructor(
    private gameMap: GameMap,
    private player: Player,
    private mapContainer: GameMapContainer,
    private roomInfoContainer: RoomInfoContainer,
    private responseContainer: ResponseContainer,
    private moveController: MoveController = new MoveController(),
  ) {}

  public async processInput(inputString: string, resetInputCallback: () => void) {
    if (inputString.length === 1 && Object.keys(MOVEMENT_DIRECTION_STRING_TO_VECTOR2).includes(inputString)) {
      const controllerResponse = this.moveController.movePlayer(
        MOVEMENT_DIRECTION_STRING_TO_VECTOR2[inputString],
        this.gameMap,
        this.player,
      );

      if (controllerResponse.actionSuccess) {
        this.mapContainer.renderMap(this.gameMap, this.player.position);
        this.roomInfoContainer.renderRoomInfo(this.player.currentRoom);
      }

      if (controllerResponse.responseToPlayer) {
        await this.responseContainer.renderResponse(controllerResponse.responseToPlayer, 1);
      }
    }

    resetInputCallback();
  }
}
