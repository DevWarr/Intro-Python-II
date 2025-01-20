import { Container, ContainerOptions } from "pixi.js";
import { Player } from "../models/Player";
import { buildTextListWithColors } from "./buildTextListWithColors";

export class PlayerInventoryContainer {
  constructor(
    containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  renderPlayerInventory(player: Player) {
    const inventoryHeader = `~W${player.name}'s inventory:`;
    const playerInventoryStrings = player.invenvtory.map((item) => `  ~c( ${item.name} )~e`);

    this.container.removeChildren();
    [inventoryHeader, ...playerInventoryStrings].forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
