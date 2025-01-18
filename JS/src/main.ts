import { Application, Sprite, Texture } from "pixi.js";
import { GameContainer } from "./views/GameContainer";

const ONE_REM_IN_PX = 16;

const app = new Application();
await app.init({
  width: 82 * ONE_REM_IN_PX,
  height: 20 * ONE_REM_IN_PX,
});
app.renderer.view.resolution = 1;
document.getElementById("app")!.appendChild(app.canvas);

const setBackgroundColor = (color: number, gameContainer: GameContainer) => {
  const containerOptions = gameContainer.containerOptions;
  console.log({
    width: containerOptions.width,
    height: containerOptions.height,
    x: containerOptions.x,
    y: containerOptions.y,
  });

  const background = new Sprite(Texture.WHITE);
  background.width = containerOptions.width ?? app.canvas.width;
  background.height = containerOptions.height ?? app.canvas.height;
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
setBackgroundColor(0xff00ff, inputContainer);

const responseContainer = new GameContainer({
  width: 82 * ONE_REM_IN_PX,
  height: 1 * ONE_REM_IN_PX,
  x: 0,
  y: 13 * ONE_REM_IN_PX,
});
setBackgroundColor(0x00ffff, responseContainer);

app.stage.addChild(mapContainer.container);
app.stage.addChild(legendContainer.container);
app.stage.addChild(inventoryContainer.container);
app.stage.addChild(infoContainer.container);
app.stage.addChild(actionContainer.container);
app.stage.addChild(inputContainer.container);
app.stage.addChild(responseContainer.container);
