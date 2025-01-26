import { GameManager, GameStateType } from "../managers/GameManager";
import { GuardianName, GuardianPose } from "../models/Guardians";
import { DEBUG_ROOM } from "../models/Room";
import { ControlsContainer, ControlType } from "../views/ControlsContainer";
import { GameMapContainer } from "../views/GameMapContainer";
import { GuardianPoseContainer } from "../views/GuardianPoseContainer";
import { MapLegendContainer } from "../views/MapLegendContainer";
import { PlayerInventoryContainer } from "../views/PlayerInventoryContainer";
import { ResponseContainer } from "../views/ResponseContainer";
import { RoomInfoContainer } from "../views/RoomInfoContainer";
import { GameState } from "./GameState";

const options: string[] = [
  "GameMap",
  "GameMap",
  "GameMap",
  GuardianName.MULTIP,
  GuardianName.DIVID,
  GuardianName.SQUARE,
  GuardianName.RADICAL,
  GuardianName.ARTIFACT,
];

export class IntroductionState implements GameState {
  constructor(
    private gameManager: GameManager,
    private gameMapContainer: GameMapContainer,
    private guardianPoseContainer: GuardianPoseContainer,
    private mapLegendContainer: MapLegendContainer,
    private playerInventoryContainer: PlayerInventoryContainer,
    private roomInfoContainer: RoomInfoContainer,
    private contrtolsContainer: ControlsContainer,
    private responseContainer: ResponseContainer,
  ) {}

  private renderTopLeftContainer() {
    const itemToRender = options[Math.floor(Math.random() * options.length)];
    if (itemToRender === "GameMap") {
      this.gameMapContainer.container.alpha = 1;
      this.guardianPoseContainer.container.alpha = 0;
      return this.gameMapContainer.renderMap(this.gameManager.gameMap, this.gameManager.player.position);
    }

    this.gameMapContainer.container.alpha = 0;
    this.guardianPoseContainer.container.alpha = 1;
    return this.guardianPoseContainer.renderGuardian(itemToRender as GuardianName, GuardianPose.STAND);
  }

  public startRendering() {
    this.renderTopLeftContainer();
    this.mapLegendContainer.renderMapLegend();
    this.playerInventoryContainer.renderPlayerInventory(this.gameManager.player);
    this.roomInfoContainer.renderRoomInfo(DEBUG_ROOM);
    this.contrtolsContainer.renderControlType(ControlType.INTRO);
  }

  public stopRendering() {
    // Only the guardian pose container needs to become invisible.
    // All other coantiners will be used and active in the Exploration state
    this.guardianPoseContainer.container.alpha = 0;
  }

  public updateRendering() {
    this.playerInventoryContainer.renderPlayerInventory(this.gameManager.player);
  }

  public async processInput(inputString: string) {
    if (inputString.length > 15) {
      await this.responseContainer.renderResponse(
        "~RThat name is too long! Please ~Wtype a name~R with fewer than 15 characters.",
      );
    } else {
      this.gameManager.createNewPlayer(inputString);
      this.playerInventoryContainer.renderPlayerInventory(this.gameManager.player);
      await this.responseContainer.showStartingMessage();
      this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
    }
  }
}
