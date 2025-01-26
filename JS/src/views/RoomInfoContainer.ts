import { Container, ContainerOptions } from "pixi.js";
import { Room } from "../models/Room";
import { buildTextListWithColors } from "./buildTextListWithColors";

export class RoomInfoContainer {
  constructor(
    containerOptions: ContainerOptions,
    readonly container: Container = new Container(containerOptions),
  ) {}

  public renderRoomInfo(room: Room) {
    const roomNameString = `~W${room.name}`;
    const roomDescriptionString = `~g${room.description}`;

    const itemNameString = room.inventory.inventoryNames.map((itemName: string) => `~c(${itemName})~e`);
    const roomInventoryString = `Items: [ ${itemNameString.length ? itemNameString.join(" ") : "~xempty~e"} ]`;

    this.container.removeChildren();
    [roomNameString, roomDescriptionString, roomInventoryString].forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
