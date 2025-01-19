import { Application, Sprite, Text, Texture } from "pixi.js";
import { GameContainer } from "./views/GameContainer";
import { sleep } from "./utils/time";

const ONE_REM_IN_PX = 16;

const app = new Application();
await app.init({
  width: 82 * ONE_REM_IN_PX,
  height: 20 * ONE_REM_IN_PX,
});
app.renderer.view.resolution = 1;
document.getElementById("app")!.appendChild(app.canvas);

const setBackgroundColor = (color: number, gameContainer: GameContainer) => {
  const background = new Sprite(Texture.WHITE);
  background.width = gameContainer.containerOptions.width ?? app.canvas.width;
  background.height = gameContainer.containerOptions.height ?? app.canvas.height;
  background.tint = color;
  gameContainer.container.addChild(background);
};

const mapContainer = new GameContainer({
  width: 22 * ONE_REM_IN_PX,
  height: 5 * ONE_REM_IN_PX,
  x: 0,
  y: 1 * ONE_REM_IN_PX,
});
setBackgroundColor(0xffffff, mapContainer);

const legendContainer = new GameContainer({
  width: 21 * ONE_REM_IN_PX,
  height: 5 * ONE_REM_IN_PX,
  x: 22 * ONE_REM_IN_PX,
  y: 1 * ONE_REM_IN_PX,
});
setBackgroundColor(0xff0000, legendContainer);

const inventoryContainer = new GameContainer({
  width: 20 * ONE_REM_IN_PX,
  height: 5 * ONE_REM_IN_PX,
  x: 43 * ONE_REM_IN_PX,
  y: 1 * ONE_REM_IN_PX,
});
setBackgroundColor(0x00ff00, inventoryContainer);

const infoContainer = new GameContainer({
  width: 82 * ONE_REM_IN_PX,
  height: 3 * ONE_REM_IN_PX,
  x: 0,
  y: 7 * ONE_REM_IN_PX,
});
setBackgroundColor(0x0000ff, infoContainer);

const actionContainer = new GameContainer({
  width: 82 * ONE_REM_IN_PX,
  height: 1 * ONE_REM_IN_PX,
  x: 0,
  y: 11 * ONE_REM_IN_PX,
});
setBackgroundColor(0xffff00, actionContainer);

const inputContainer = new GameContainer({
  width: 82 * ONE_REM_IN_PX,
  height: 1 * ONE_REM_IN_PX,
  x: 0,
  y: 12 * ONE_REM_IN_PX,
});

const responseContainer = new GameContainer({
  width: 82 * ONE_REM_IN_PX,
  height: 1 * ONE_REM_IN_PX,
  x: 0,
  y: 13 * ONE_REM_IN_PX,
});

const responseText = new Text({
  text: "",
  style: {
    fontSize: 16,
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
app.stage.addChild(inventoryContainer.container);
app.stage.addChild(infoContainer.container);
app.stage.addChild(actionContainer.container);
app.stage.addChild(inputContainer.container);
app.stage.addChild(responseContainer.container);

const TEXT_PLACEHOLDER = ">>  ";
const playerInputText = new Text({
  text: TEXT_PLACEHOLDER,
  style: {
    fontSize: 16,
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
