import { ContainerOptions, Container, Sprite, Texture } from "pixi.js";
import { FONT_SIZE_PX } from "../models/SizeVector2";
import { sleep } from "../utils/time";
import { buildTextListWithColors } from "./buildTextListWithColors";

export class OverlayContainer {
  readonly container: Container;
  private endCreditsContainer: Container;
  private totalTimeTakenContainer: Container;
  private foregroundSprite: Sprite;
  private totalRowsOfTextInContainer: number = 22;

  constructor(containerOptions: ContainerOptions, container: Container = new Container(containerOptions)) {
    this.container = container;

    this.endCreditsContainer = new Container({ x: 35 * FONT_SIZE_PX.w, y: 6 * FONT_SIZE_PX.h, alpha: 0 });
    ["~WThanks for playing!", "", "~G      - WarVDine"].forEach((text, index) => {
      buildTextListWithColors(text, index).forEach((textSprite) => {
        this.endCreditsContainer.addChild(textSprite);
      });
    });

    this.totalTimeTakenContainer = new Container({ x: 0, y: 18 * FONT_SIZE_PX.h });

    this.foregroundSprite = new Sprite(Texture.WHITE);
    this.foregroundSprite.tint = 0x000000;

    this.foregroundSprite.height = 0;
    this.foregroundSprite.width = containerOptions.width ?? 85 * FONT_SIZE_PX.w;
    this.container.addChild(this.foregroundSprite);
    this.container.addChild(this.endCreditsContainer);
    this.container.addChild(this.totalTimeTakenContainer);
  }

  public resetForeground() {
    this.foregroundSprite.height = 0;
  }

  public async renderTransition() {
    for (let i = 0; i < this.totalRowsOfTextInContainer; i++) {
      this.foregroundSprite.height = i * FONT_SIZE_PX.h;
      await sleep(0.05);
    }
    await sleep(0.25);
  }

  public renderFullForeground() {
    this.foregroundSprite.height = this.totalRowsOfTextInContainer * FONT_SIZE_PX.h;
  }

  public renderEndCredits(totalMillisecondsTaken: number) {
    this.endCreditsContainer.alpha = 1;

    const minutes = Math.floor(totalMillisecondsTaken / 60000);
    const seconds = Math.floor((totalMillisecondsTaken % 60000) / 1000);
    const milliseconds = totalMillisecondsTaken % 1000;

    const totalPlayTimeString = `~WTotal play time: ~Y${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    buildTextListWithColors(totalPlayTimeString, 0).forEach((textSprite) => {
      this.totalTimeTakenContainer.addChild(textSprite);
    });
  }
}
