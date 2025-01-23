import { InventoryController } from "../controllers/InventoryController";
import { MoveController } from "../controllers/MoveController";
import { GameManager, GameStateType } from "../GameManager";
import { GameMap } from "../models/GameMap";
import { Player } from "../models/Player";
import { PositionVector2 } from "../models/PositionVector2";
import { Shrine } from "../models/Room";
import { ControlsContainer, ControlType } from "../views/ControlsContainer";
import { GameMapContainer } from "../views/GameMapContainer";
import { MapLegendContainer } from "../views/MapLegendContainer";
import { PlayerInventoryContainer } from "../views/PlayerInventoryContainer";
import { ResponseContainer } from "../views/ResponseContainer";
import { RoomInfoContainer } from "../views/RoomInfoContainer";
import { GameState } from "./GameState";

const MOVEMENT_DIRECTION_STRING_TO_VECTOR2: Record<string, PositionVector2> = {
  n: PositionVector2.UP,
  s: PositionVector2.DOWN,
  w: PositionVector2.LEFT,
  e: PositionVector2.RIGHT,
};

const INVENTORY_ACTIONS = ["take", "drop"];

export interface ExplorationStateActionResponse {
  actionSuccess: boolean;
  responseToPlayer?: string;
}

export class ExplorationState implements GameState {
  constructor(
    private gameManager: GameManager,
    private gameMap: GameMap,
    private player: Player,
    private mapContainer: GameMapContainer,
    private mapLegendContainer: MapLegendContainer,
    private playerInventoryContainer: PlayerInventoryContainer,
    private roomInfoContainer: RoomInfoContainer,
    private controlsContainer: ControlsContainer,
    private responseContainer: ResponseContainer,
    private moveController: MoveController = new MoveController(),
    private inventoryController: InventoryController = new InventoryController(),
  ) {}

  public startRendering() {
    this.mapContainer.container.alpha = 1;
    this.mapLegendContainer.container.alpha = 1;
    this.roomInfoContainer.container.alpha = 1;
    this.controlsContainer.container.alpha = 1;

    this.controlsContainer.renderControlType(ControlType.SIMPLE);
    this.updateRendering();
  }

  public stopRendering() {
    this.mapContainer.container.alpha = 0;
    this.mapLegendContainer.container.alpha = 0;
    this.roomInfoContainer.container.alpha = 0;
  }

  public updateRendering() {
    this.mapContainer.renderMap(this.gameMap, this.player.position);
    this.mapLegendContainer.renderMapLegend();
    this.roomInfoContainer.renderRoomInfo(this.gameMap.getRoomAtPosition(this.player.position)!);
  }

  private get isGuardianToFight() {
    return (
      this.gameMap.getRoomAtPosition(this.player.position) instanceof Shrine &&
      (this.gameMap.getRoomAtPosition(this.player.position) as Shrine).guardian.isAlive
    );
  }

  public async processInput(inputString: string, resetInputCallback: () => void) {
    const playerInputList = inputString.toLowerCase().split(" ");
    const playerAction = playerInputList[0];

    if (Object.keys(MOVEMENT_DIRECTION_STRING_TO_VECTOR2).includes(playerAction)) {
      const controllerResponse = this.moveController.movePlayer(
        MOVEMENT_DIRECTION_STRING_TO_VECTOR2[playerAction],
        this.gameMap,
        this.player,
      );

      if (controllerResponse.actionSuccess) {
        this.mapContainer.renderMap(this.gameMap, this.player.position);
        this.roomInfoContainer.renderRoomInfo(this.gameMap.getRoomAtPosition(this.player.position)!);
        if (this.isGuardianToFight) {
          return this.gameManager.changeGameStateType(GameStateType.BATTLE);
        }
      }

      if (controllerResponse.responseToPlayer) {
        await this.responseContainer.renderResponse(controllerResponse.responseToPlayer, 1);
      }
    }

    if (INVENTORY_ACTIONS.includes(playerAction)) {
      const itemName = playerInputList[1];
      const currentRoom = this.gameMap.getRoomAtPosition(this.player.position)!;

      const controllerResponse: ExplorationStateActionResponse =
        playerAction === "take"
          ? this.inventoryController.takeItem(currentRoom, this.player, itemName)
          : this.inventoryController.dropItem(currentRoom, this.player, itemName);

      if (controllerResponse.actionSuccess) {
        this.roomInfoContainer.renderRoomInfo(this.gameMap.getRoomAtPosition(this.player.position)!);
        this.playerInventoryContainer.renderPlayerInventory(this.player);
      }

      if (controllerResponse?.responseToPlayer) {
        await this.responseContainer.renderResponse(controllerResponse.responseToPlayer, 1);
      }
    }

    resetInputCallback();
  }
}
