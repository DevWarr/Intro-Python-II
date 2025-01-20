import { Application, Container, Text } from "pixi.js";
import { ControlsContainer, ControlType } from "./views/ControlsContainer";
import { FONT_SIZE_PX } from "./models/SizeVector2";
import { MapLegendContainer } from "./views/MapLegendContainer";
import { RoomInfoContainer } from "./views/RoomInfoContainer";
import { DEBUG_ROOM } from "./models/Room";
import { PlayerInventoryContainer } from "./views/PlayerInventoryContainer";
import { DebugPlayer } from "./models/Player";
import { GameMapContainer } from "./views/GameMapContainer";
import { GameMap } from "./models/GameMap";

const MAX_CHARACTERS_WIDTH = 85;

const app = new Application();
await app.init({
  width: MAX_CHARACTERS_WIDTH * FONT_SIZE_PX.w,
  height: 20 * FONT_SIZE_PX.h,
});
app.renderer.view.resolution = 2;
document.getElementById("app")!.appendChild(app.canvas);

const gameMap = new GameMap();
const debugPlayer = new DebugPlayer("testing testing");

const mapContainer = new GameMapContainer({
  x: 0,
  y: 1 * FONT_SIZE_PX.h,
});
mapContainer.renderMap(gameMap, debugPlayer.position);

const legendContainer = new MapLegendContainer({
  x: 25 * FONT_SIZE_PX.w,
  y: 1 * FONT_SIZE_PX.h,
});
legendContainer.renderMapLegend();

const playerInventoryContainer = new PlayerInventoryContainer({
  x: 53 * FONT_SIZE_PX.w,
  y: 1 * FONT_SIZE_PX.h,
});
playerInventoryContainer.renderPlayerInventory(debugPlayer);

const roomInfoContainer = new RoomInfoContainer({
  x: 0,
  y: 9 * FONT_SIZE_PX.h,
});
roomInfoContainer.renderRoomInfo(DEBUG_ROOM);

const controlsContainer = new ControlsContainer({
  x: 0,
  y: 14 * FONT_SIZE_PX.h,
});
controlsContainer.setActiveControl(ControlType.INTRO);

const inputContainer = new Container({
  x: 0,
  y: 15 * FONT_SIZE_PX.h,
});

const responseContainer = new Container({
  x: 0,
  y: 16 * FONT_SIZE_PX.h,
});

const responseText = new Text({
  text: "",
  style: {
    fontSize: FONT_SIZE_PX.h,
    fontFamily: "monospace",
    fontWeight: "normal",
    fill: "gray",
  },
  x: 0,
  y: 0,
});
responseContainer.addChild(responseText);

app.stage.addChild(mapContainer.container);
app.stage.addChild(legendContainer.container);
app.stage.addChild(playerInventoryContainer.container);
app.stage.addChild(roomInfoContainer.container);
app.stage.addChild(controlsContainer.container);
app.stage.addChild(inputContainer);
app.stage.addChild(responseContainer);

const TEXT_PLACEHOLDER = ">>  ";
const playerInputText = new Text({
  text: TEXT_PLACEHOLDER,
  style: {
    fontSize: FONT_SIZE_PX.h,
    fontFamily: "monospace",
    fontWeight: "normal",
    fill: "white",
  },
  x: 0,
  y: 0,
});

inputContainer.addChild(playerInputText);

let playerCanType = true;

document.onkeydown = async (e) => {
  if (!playerCanType) return;

  // validate input to only allow alphanumeric characters
  if (e.key.match(/^[a-zA-Z0-9 ]$/)) {
    playerInputText.text += e.key;
  }

  if (e.key === "Backspace") {
    playerInputText.text = playerInputText.text.slice(0, -1);
  }

  if (e.key === "Enter") {
    if (playerInputText.text !== TEXT_PLACEHOLDER) {
      playerCanType = false;
      responseText.text = playerInputText.text.replace(TEXT_PLACEHOLDER, "").trim();

      setTimeout(() => {
        playerCanType = true;
        playerInputText.text = TEXT_PLACEHOLDER;
        responseText.text = "";
      }, 1000);
    }
  }
};
