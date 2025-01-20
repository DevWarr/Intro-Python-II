import { Application, Sprite, Text, Texture } from "pixi.js";
import { GameContainer } from "./views/GameContainer";
import { ControlsContainer, ControlType } from "./views/ControlsContainer";
import { FONT_SIZE_PX } from "./models/SizeVector2";
import { MapLegendContainer } from "./views/MapLegendContainer";
import { RoomInfoContainer } from "./views/RoomInfoContainer";
import { DEBUG_ROOM } from "./models/Room";
import { PlayerInventoryContainer } from "./views/PlayerInventoryContainer";
import { DebugPlayer } from "./models/Player";

const MAX_CHARACTERS_WIDTH = 85;

const app = new Application();
await app.init({
  width: MAX_CHARACTERS_WIDTH * FONT_SIZE_PX.w,
  height: 20 * FONT_SIZE_PX.h,
});
app.renderer.view.resolution = 2;
document.getElementById("app")!.appendChild(app.canvas);

const setBackgroundColor = (color: number, gameContainer: GameContainer) => {
  const background = new Sprite(Texture.WHITE);
  background.width = gameContainer.containerOptions.width ?? app.canvas.width;
  background.height = gameContainer.containerOptions.height ?? app.canvas.height;
  background.tint = color;
  gameContainer.container.addChild(background);
};

const mapContainer = new GameContainer({
  width: 22 * FONT_SIZE_PX.w,
  height: 5 * FONT_SIZE_PX.h,
  x: 0,
  y: 1 * FONT_SIZE_PX.h,
});
setBackgroundColor(0xffffff, mapContainer);

const legendContainer = new MapLegendContainer({
  x: 23 * FONT_SIZE_PX.w,
  y: 1 * FONT_SIZE_PX.h,
});
legendContainer.renderMapLegend();

const playerInventoryContainer = new PlayerInventoryContainer({
  x: 53 * FONT_SIZE_PX.w,
  y: 1 * FONT_SIZE_PX.h,
});
const debugPlayer = new DebugPlayer("testing testing");
playerInventoryContainer.renderPlayerInventory(debugPlayer);

const roomInfoContainer = new RoomInfoContainer({
  x: 0,
  y: 7 * FONT_SIZE_PX.h,
});
roomInfoContainer.renderRoomInfo(DEBUG_ROOM);

const controlsContainer = new ControlsContainer({
  x: 0,
  y: 11 * FONT_SIZE_PX.h,
});
controlsContainer.setActiveControl(ControlType.INTRO);

const inputContainer = new GameContainer({
  x: 0,
  y: 12 * FONT_SIZE_PX.h,
});

const responseContainer = new GameContainer({
  x: 0,
  y: 13 * FONT_SIZE_PX.h,
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
responseContainer.container.addChild(responseText);

app.stage.addChild(mapContainer.container);
app.stage.addChild(legendContainer.container);
app.stage.addChild(playerInventoryContainer.container);
app.stage.addChild(roomInfoContainer.container);
app.stage.addChild(controlsContainer.container);
app.stage.addChild(inputContainer.container);
app.stage.addChild(responseContainer.container);

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

inputContainer.container.addChild(playerInputText);

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
