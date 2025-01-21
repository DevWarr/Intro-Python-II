import { Application } from "pixi.js";
import { ControlsContainer, ControlType } from "./views/ControlsContainer";
import { FONT_SIZE_PX } from "./models/SizeVector2";
import { MapLegendContainer } from "./views/MapLegendContainer";
import { RoomInfoContainer } from "./views/RoomInfoContainer";
import { PlayerInventoryContainer } from "./views/PlayerInventoryContainer";
import { GamePlayer } from "./models/Player";
import { GameMapContainer } from "./views/GameMapContainer";
import { GameMap } from "./models/GameMap";
import { ResponseContainer } from "./views/ResponseContainer";
import { ExplorationState } from "./GameStates/ExplorationState";
import { PlayerInputContainer } from "./views/PlayerInputContainer";
import { GuardianPoseContainer } from "./views/GuardianPoseContainer";
import { GuardianName, GuardianPose } from "./models/Guardians";
import { BattleInfoContainer } from "./views/BattleInfoContainer";
import { GuardianQuestionContainer } from "./views/GuardianQuestionContainer";

const MAX_CHARACTERS_WIDTH = 85;

const app = new Application();
await app.init({
  width: MAX_CHARACTERS_WIDTH * FONT_SIZE_PX.w,
  height: 20 * FONT_SIZE_PX.h,
});
app.renderer.view.resolution = 2;
document.getElementById("app")!.appendChild(app.canvas);

const mapContainer = new GameMapContainer({ x: 0, y: 1 * FONT_SIZE_PX.h });
const guardianPoseContainer = new GuardianPoseContainer({ x: 0, y: 1 * FONT_SIZE_PX.h });
const legendContainer = new MapLegendContainer({ x: 25 * FONT_SIZE_PX.w, y: 1 * FONT_SIZE_PX.h });
const battleInfoContainer = new BattleInfoContainer({ x: 25 * FONT_SIZE_PX.w, y: 1 * FONT_SIZE_PX.h });
const playerInventoryContainer = new PlayerInventoryContainer({ x: 53 * FONT_SIZE_PX.w, y: 1 * FONT_SIZE_PX.h });
const roomInfoContainer = new RoomInfoContainer({ x: 0, y: 9 * FONT_SIZE_PX.h });
const guardianQuestionContainer = new GuardianQuestionContainer({ x: 0, y: 9 * FONT_SIZE_PX.h });
const controlsContainer = new ControlsContainer({ x: 0, y: 14 * FONT_SIZE_PX.h });
const inputContainer = new PlayerInputContainer({ x: 0, y: 15 * FONT_SIZE_PX.h });
const responseContainer = new ResponseContainer({ x: 0, y: 16 * FONT_SIZE_PX.h });

app.stage.addChild(mapContainer.container);
app.stage.addChild(guardianPoseContainer.container);
app.stage.addChild(legendContainer.container);
app.stage.addChild(battleInfoContainer.container);
app.stage.addChild(playerInventoryContainer.container);
app.stage.addChild(roomInfoContainer.container);
app.stage.addChild(guardianQuestionContainer.container);
app.stage.addChild(controlsContainer.container);
app.stage.addChild(inputContainer.container);
app.stage.addChild(responseContainer.container);

let playerCanType = true;
let playerInput = "";
const resetPlayerInput = () => {
  playerInput = "";
  inputContainer.renderPlayerInput(playerInput);
  playerCanType = true;
};

const gameMap = new GameMap();
const player = new GamePlayer("My player here");

const currentGameState = new ExplorationState(
  gameMap,
  player,
  mapContainer,
  playerInventoryContainer,
  roomInfoContainer,
  responseContainer,
);

// mapContainer.renderMap(gameMap, player.position);
guardianPoseContainer.renderGuardian(GuardianName.DIVID, GuardianPose.INCORRECT);
// legendContainer.renderMapLegend();
battleInfoContainer.renderBattleInfo(5, 3);
playerInventoryContainer.renderPlayerInventory(player);
// roomInfoContainer.renderRoomInfo(gameMap.getRoomAtPosition(player.position)!);
guardianQuestionContainer.renderGuardianQuestion(
  GuardianName.ARTIFACT,
  "test description",
  "test ~WQ~cu~be~cs~yt~eion",
);
controlsContainer.renderControlType(ControlType.BATTLE);

document.onkeydown = (e) => {
  if (!playerCanType) return;

  // validate input to only allow alphanumeric characters
  if (e.key.match(/^[a-zA-Z0-9 ]$/)) {
    playerInput += e.key;
    inputContainer.renderPlayerInput(playerInput);
  }

  if (e.key === "Backspace") {
    playerInput = playerInput.slice(0, -1);
    inputContainer.renderPlayerInput(playerInput);
  }

  if (e.key === "Enter") {
    if (playerInput.length > 0) {
      playerCanType = false;
      currentGameState.processInput(playerInput.trim(), resetPlayerInput);
    }
  }
};
