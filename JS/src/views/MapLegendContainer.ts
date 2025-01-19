import { ContainerOptions, Container } from "pixi.js";
import { buildTextListWithColors } from "./buildTextListWithColors";

const MAP_LEGEND = [
  "~Y[ ]~e You are here",
  "[A] Artifact Shrine",
  "[X] Cave Entrance",
  "[S] Shrine",
  "~W[ ]~e Has Item",
];

export class MapLegendContainer {
  constructor(
    public containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {
    MAP_LEGEND.forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
