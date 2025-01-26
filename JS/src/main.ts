import { Application } from "pixi.js";
import { FONT_SIZE_PX } from "./models/SizeVector2";
import { GameManager } from "./managers/GameManager";

const startGame = async () => {
  document.getElementById("start-game-button")!.style.display = "none";

  const app = new Application();
  await app.init({
    width: 85 * FONT_SIZE_PX.w,
    height: 20 * FONT_SIZE_PX.h,
  });
  app.renderer.view.resolution = 2;
  document.getElementById("app")!.appendChild(app.canvas);
  document.getElementById("app")!.style.display = "block";

  let playerCanType = true;
  let playerInput = "";
  const resetPlayerInput = () => {
    playerInput = "";
    gameManager.inputContainer.renderPlayerInput(playerInput);
    playerCanType = true;
  };

  const gameManager = new GameManager(app, resetPlayerInput);

  document.onkeydown = (e) => {
    if (!playerCanType) return;

    // validate input to only allow alphanumeric characters
    if (e.key.match(/^[a-zA-Z0-9 ]$/)) {
      playerInput += e.key;
      gameManager.inputContainer.renderPlayerInput(playerInput);
    }

    if (e.key === "Backspace") {
      playerInput = playerInput.slice(0, -1);
      gameManager.inputContainer.renderPlayerInput(playerInput);
    }

    if (e.key === "Enter") {
      if (playerInput.length > 0) {
        playerCanType = false;
        gameManager.processInput(playerInput.trim(), resetPlayerInput);
      }
    }
  };
};

document.getElementById("start-game-button")!.onclick = startGame;
