import { Application } from "pixi.js";
import { BattleState } from "../GameStates/BattleState";
import { ExplorationState } from "../GameStates/ExplorationState";
import { GameState } from "../GameStates/GameState";
import { GameMap } from "../models/GameMap";
import { DebugPlayer, GamePlayer, Player } from "../models/Player";
import { FONT_SIZE_PX } from "../models/SizeVector2";
import { BattleInfoContainer } from "../views/BattleInfoContainer";
import { ControlsContainer } from "../views/ControlsContainer";
import { GameMapContainer } from "../views/GameMapContainer";
import { GuardianPoseContainer } from "../views/GuardianPoseContainer";
import { GuardianQuestionContainer } from "../views/GuardianQuestionContainer";
import { MapLegendContainer } from "../views/MapLegendContainer";
import { PlayerInputContainer } from "../views/PlayerInputContainer";
import { PlayerInventoryContainer } from "../views/PlayerInventoryContainer";
import { ResponseContainer } from "../views/ResponseContainer";
import { RoomInfoContainer } from "../views/RoomInfoContainer";
import { Shrine } from "../models/Room";
import { IntroductionState } from "../GameStates/IntroductionState";
import { StateTransitionContainer } from "../views/StateTransitionContainer";
import { AudioManager } from "./AudioManager";

export enum GameStateType {
  INTRO,
  EXPLORATION,
  BATTLE,
}

export class GameManager {
  readonly mapContainer: GameMapContainer;
  readonly guardianPoseContainer: GuardianPoseContainer;
  readonly legendContainer: MapLegendContainer;
  readonly battleInfoContainer: BattleInfoContainer;
  readonly playerInventoryContainer: PlayerInventoryContainer;
  readonly roomInfoContainer: RoomInfoContainer;
  readonly guardianQuestionContainer: GuardianQuestionContainer;
  readonly controlsContainer: ControlsContainer;
  readonly inputContainer: PlayerInputContainer;
  readonly responseContainer: ResponseContainer;
  readonly transitionContainer: StateTransitionContainer;
  readonly audioManager: AudioManager = new AudioManager();
  private __player: Player;
  get player() {
    return this.__player;
  }

  /**
   * Creates a new player.
   *
   * WARNING: If the player already exists, an error will be thrown.
   */
  public createNewPlayer(playerName: string) {
    if (this.__player instanceof GamePlayer) {
      throw new Error("Player already exists.");
    }
    this.__player = new GamePlayer(playerName);
  }

  private __gameMap: GameMap;
  get gameMap() {
    return this.__gameMap;
  }

  private __currentGameState: GameState;
  private __isAskingPlayerToQuit: boolean = false;

  constructor(
    pixiApp: Application,
    private resetInputCallback: () => void,
  ) {
    this.mapContainer = new GameMapContainer({ x: 0, y: 1 * FONT_SIZE_PX.h });
    this.guardianPoseContainer = new GuardianPoseContainer({ x: 0, y: 1 * FONT_SIZE_PX.h });
    this.legendContainer = new MapLegendContainer({ x: 25 * FONT_SIZE_PX.w, y: 1 * FONT_SIZE_PX.h });
    this.battleInfoContainer = new BattleInfoContainer({ x: 25 * FONT_SIZE_PX.w, y: 1 * FONT_SIZE_PX.h });
    this.playerInventoryContainer = new PlayerInventoryContainer({ x: 53 * FONT_SIZE_PX.w, y: 1 * FONT_SIZE_PX.h });
    this.roomInfoContainer = new RoomInfoContainer({ x: 0, y: 9 * FONT_SIZE_PX.h });
    this.guardianQuestionContainer = new GuardianQuestionContainer({ x: 0, y: 9 * FONT_SIZE_PX.h });
    this.controlsContainer = new ControlsContainer({ x: 0, y: 14 * FONT_SIZE_PX.h });
    this.inputContainer = new PlayerInputContainer({ x: 0, y: 15 * FONT_SIZE_PX.h });
    this.responseContainer = new ResponseContainer({ x: 0, y: 16 * FONT_SIZE_PX.h });
    this.transitionContainer = new StateTransitionContainer({ x: 0, y: 0, width: pixiApp.screen.width });

    pixiApp.stage.addChild(this.mapContainer.container);
    pixiApp.stage.addChild(this.guardianPoseContainer.container);
    pixiApp.stage.addChild(this.legendContainer.container);
    pixiApp.stage.addChild(this.battleInfoContainer.container);
    pixiApp.stage.addChild(this.playerInventoryContainer.container);
    pixiApp.stage.addChild(this.roomInfoContainer.container);
    pixiApp.stage.addChild(this.guardianQuestionContainer.container);
    pixiApp.stage.addChild(this.controlsContainer.container);
    pixiApp.stage.addChild(this.inputContainer.container);
    pixiApp.stage.addChild(this.responseContainer.container);
    pixiApp.stage.addChild(this.transitionContainer.container);

    this.__gameMap = new GameMap();
    this.__player = new DebugPlayer("Winner");
    this.__currentGameState = new IntroductionState(
      this,
      this.mapContainer,
      this.guardianPoseContainer,
      this.legendContainer,
      this.playerInventoryContainer,
      this.roomInfoContainer,
      this.controlsContainer,
      this.responseContainer,
    );
    this.__currentGameState.startRendering();
    this.playerInventoryContainer.renderPlayerInventory(this.player);
  }

  public async processInput(inputString: string, resetInputCallback: () => void) {
    if (this.__isAskingPlayerToQuit) {
      if (["y", "yes"].includes(inputString.toLowerCase())) {
        // TODO: We should probably have a better way of resetting the game
        window.location.reload();
      } else {
        this.__isAskingPlayerToQuit = false;
        await this.responseContainer.renderResponse("~gYou have chosen to continue.");
      }
    } else if (["q", "quit"].includes(inputString.toLowerCase())) {
      this.__isAskingPlayerToQuit = true;
      this.responseContainer.renderResponseWithoutReset(
        "~pAre you sure you want to quit? (Press 'Y' to confirm; any other key to cancel)",
      );
    } else {
      await this.__currentGameState.processInput(inputString);
    }
    resetInputCallback();
  }

  public async changeGameStateType(newStateType: GameStateType) {
    await this.transitionContainer.renderTransition();

    this.__currentGameState.stopRendering();
    if (newStateType === GameStateType.EXPLORATION) {
      this.__currentGameState = new ExplorationState(
        this,
        this.__gameMap,
        this.__player,
        this.mapContainer,
        this.legendContainer,
        this.playerInventoryContainer,
        this.roomInfoContainer,
        this.controlsContainer,
        this.responseContainer,
      );
    } else if (newStateType === GameStateType.BATTLE) {
      this.__currentGameState = new BattleState(
        this,
        this.__player,
        (this.__gameMap.getRoomAtPosition(this.__player.position) as Shrine).guardian,
        this.guardianPoseContainer,
        this.battleInfoContainer,
        this.guardianQuestionContainer,
        this.controlsContainer,
        this.responseContainer,
      );
    }

    this.__currentGameState.startRendering();
    this.transitionContainer.resetTransitionOverlay();
    this.resetInputCallback();
  }
}
