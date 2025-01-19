import { Container, ContainerOptions } from "pixi.js";
import { Room } from "../models/Room";
import { Item } from "../models/Item";
import { buildTextListWithColors } from "./buildTextListWithColors";

export class RoomInfoContainer {
  constructor(
    public containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  renderRoomInfo(room: Room) {
    const roomNameString = `~W${room.name}`;
    const roomDescriptionString = `~g${room.description}`;

    const itemNameString = room.inventory.map((item: Item) => `~c(${item.name})~e`);
    const roomInventoryString = `Items: [ ${itemNameString.length ? itemNameString.join(" ") : "~xempty~e"} ]`;

    [roomNameString, roomDescriptionString, roomInventoryString].forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
