import { InventoryController } from "../controllers/InventoryController";
import { MoveController } from "../controllers/MoveController";
import { UseItemController } from "../controllers/UseItemController";
import { GameManager, GameStateType } from "../managers/GameManager";
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
  north: PositionVector2.UP,
  s: PositionVector2.DOWN,
  south: PositionVector2.DOWN,
  w: PositionVector2.LEFT,
  west: PositionVector2.LEFT,
  e: PositionVector2.RIGHT,
  east: PositionVector2.RIGHT,
};

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
    private useItemController: UseItemController = new UseItemController(),
    // If the room has an item, the controls will be advanced. Otherwise, they will be simple.
    private controlsType: ControlType = gameMap.getRoomAtPosition(player.position)!.inventory.length > 0
      ? ControlType.ADVANCED
      : ControlType.SIMPLE,
  ) {}

  public startRendering() {
    this.mapContainer.container.alpha = 1;
    this.mapLegendContainer.container.alpha = 1;
    this.roomInfoContainer.container.alpha = 1;
    this.controlsContainer.container.alpha = 1;

    this.controlsContainer.renderControlType(this.controlsType);
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

  private handleMovementAction(playerAction: string) {
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
      this.responseContainer.renderResponse(controllerResponse.responseToPlayer, 1);
    }
  }

  private handleInventoryAction(playerAction: string, itemName: string) {
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
      this.responseContainer.renderResponse(controllerResponse.responseToPlayer, 1);
    }
  }

  private handleUseAction(itemName: string) {
    const controllerResponse = this.useItemController.useItemInRoom(
      this.player,
      this.gameMap.getRoomAtPosition(this.player.position)!,
      itemName,
    );

    // TODO: if true, end the game

    if (controllerResponse.responseToPlayer) {
      this.responseContainer.renderResponse(controllerResponse.responseToPlayer);
    }
  }

  private handleMoreControlsAction() {
    this.controlsType = this.controlsType === ControlType.ADVANCED ? ControlType.SIMPLE : ControlType.ADVANCED;
    this.controlsContainer.renderControlType(this.controlsType);
  }

  public async processInput(inputString: string) {
    const playerInputList = inputString.toLowerCase().split(" ");
    const playerAction = playerInputList[0];

    switch (playerAction) {
      case "n":
      case "north":
      case "s":
      case "south":
      case "w":
      case "west":
      case "e":
      case "east":
        this.handleMovementAction(playerAction);
        break;
      case "take":
      case "drop":
        this.handleInventoryAction(playerAction, playerInputList.slice(1).join(" "));
        break;
      case "use":
        this.handleUseAction(playerInputList.slice(1).join(" "));
        break;
      case "o":
        this.handleMoreControlsAction();
    }
  }
}
