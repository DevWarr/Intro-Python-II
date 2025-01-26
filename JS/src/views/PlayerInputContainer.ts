import { Container, ContainerOptions } from "pixi.js";
import { buildTextListWithColors } from "./buildTextListWithColors";

const TYPE_HERE_LOCATION_STRING = "~W>>  ~e";

export class PlayerInputContainer {
  constructor(
    containerOptions: ContainerOptions,
    readonly container: Container = new Container(containerOptions),
    private typeHereLocationString: string = TYPE_HERE_LOCATION_STRING,
  ) {
    this.renderPlayerInput("");
  }

  public renderPlayerInput(message: string) {
    this.container.removeChildren();
    buildTextListWithColors(this.typeHereLocationString + message).forEach((text) => this.container.addChild(text));
  }
}
