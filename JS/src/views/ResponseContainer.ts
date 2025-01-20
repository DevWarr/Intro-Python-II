import { Container, ContainerOptions } from "pixi.js";
import { sleep } from "../utils/time";
import { buildTextListWithColors } from "./buildTextListWithColors";

export class ResponseContainer {
  constructor(
    containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  public async renderResponse(message: string, secondsToShowMessage: number) {
    buildTextListWithColors(message).forEach((text) => this.container.addChild(text));
    await sleep(secondsToShowMessage);
    this.container.removeChildren();
  }
}
