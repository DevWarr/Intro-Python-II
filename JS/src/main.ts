import { Application } from "pixi.js";
import { colorTest } from "./utils/colors";

const ONE_REM_IN_PX = 16;

const app = new Application();
await app.init({
  width: 82 * ONE_REM_IN_PX,
  height: 16 * ONE_REM_IN_PX,
});
app.renderer.view.resolution = 1;
document.getElementById("app")!.appendChild(app.canvas);

colorTest();
