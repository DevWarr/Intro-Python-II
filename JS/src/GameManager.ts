import { Application } from "pixi.js";
import { BattleState } from "./GameStates/BattleState";
import { ExplorationState } from "./GameStates/ExplorationState";
import { GameState } from "./GameStates/GameState";
import { GameMap } from "./models/GameMap";
import { GamePlayer, Player } from "./models/Player";
import { FONT_SIZE_PX } from "./models/SizeVector2";
import { BattleInfoContainer } from "./views/BattleInfoContainer";
import { ControlsContainer } from "./views/ControlsContainer";
import { GameMapContainer } from "./views/GameMapContainer";
import { GuardianPoseContainer } from "./views/GuardianPoseContainer";
import { GuardianQuestionContainer } from "./views/GuardianQuestionContainer";
import { MapLegendContainer } from "./views/MapLegendContainer";
import { PlayerInputContainer } from "./views/PlayerInputContainer";
import { PlayerInventoryContainer } from "./views/PlayerInventoryContainer";
import { ResponseContainer } from "./views/ResponseContainer";
import { RoomInfoContainer } from "./views/RoomInfoContainer";
import { Shrine } from "./models/Room";

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
  private __player: Player;
  get player() {
    return this.__player;
  }
  private __gameMap: GameMap;
  get gameMap() {
    return this.__gameMap;
  }

  private __currentGameState: GameState;
  get currentGameState() {
    return this.__currentGameState;
  }

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

    this.__gameMap = new GameMap();
    this.__player = new GamePlayer("My player here");
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
    this.__currentGameState.startRendering();
    this.playerInventoryContainer.renderPlayerInventory(this.player);
  }

  public changeGameStateType(newStateType: GameStateType) {
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
    this.resetInputCallback();
  }
}
