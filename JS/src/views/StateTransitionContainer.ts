import { ContainerOptions, Container, Sprite, Texture } from "pixi.js";
import { FONT_SIZE_PX } from "../models/SizeVector2";
import { sleep } from "../utils/time";

export class StateTransitionContainer {
  readonly container: Container;
  private backgroundSprite: Sprite;
  private totalRowsOfTextInContainer: number = 22;

  constructor(containerOptions: ContainerOptions, container: Container = new Container(containerOptions)) {
    this.container = container;

    this.backgroundSprite = new Sprite(Texture.WHITE);
    this.backgroundSprite.tint = 0x000000;

    this.backgroundSprite.height = 0;
    this.backgroundSprite.width = containerOptions.width ?? 85 * FONT_SIZE_PX.w;
    this.container.addChild(this.backgroundSprite);
  }

  public resetTransitionOverlay() {
    this.backgroundSprite.height = 0;
  }

  public async renderTransition() {
    for (let i = 0; i < this.totalRowsOfTextInContainer; i++) {
      this.backgroundSprite.height = i * FONT_SIZE_PX.h;
      await sleep(0.05);
    }
    await sleep(0.25);
  }
}
