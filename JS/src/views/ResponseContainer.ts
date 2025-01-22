import { Container, ContainerOptions } from "pixi.js";
import { sleep } from "../utils/time";
import { buildTextListWithColors } from "./buildTextListWithColors";

export class ResponseContainer {
  constructor(
    containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  private determineSecondsToSleepForMessage(message: string): number {
    const numberOfWords = message.split(" ").length;
    return Math.max(1, numberOfWords / 2.5 - 1);
  }

  public async renderResponse(message: string, secondsToShowMessage?: number) {
    buildTextListWithColors(message).forEach((text) => this.container.addChild(text));
    await sleep(secondsToShowMessage ?? this.determineSecondsToSleepForMessage(message));
    this.container.removeChildren();
  }
}
