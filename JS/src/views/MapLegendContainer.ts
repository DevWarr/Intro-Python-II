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
    containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  public renderMapLegend(mapLegendStringList: string[] = MAP_LEGEND) {
    this.container.removeChildren();
    mapLegendStringList.forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
