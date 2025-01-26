import { ContainerOptions, Container } from "pixi.js";
import { GameMap } from "../models/GameMap";
import { Room, RoomType } from "../models/Room";
import { buildTextListWithColors } from "./buildTextListWithColors";
import { PositionVector2 } from "../models/PositionVector2";

export class GameMapContainer {
  constructor(
    containerOptions: ContainerOptions,
    readonly container: Container = new Container(containerOptions),
  ) {}

  public renderMap(gameMap: GameMap, playerPosition: PositionVector2) {
    // Turn a 2D array of rooms into a list of strings
    // string array is a string representation of the game map
    const mapStringList: string[] = gameMap.map.map((roomRow: Array<Room | null>, yPosition: number) => {
      return roomRow
        .map((room: Room | null, xPosition: number) => {
          if (room === null) return RoomType.EMPTY;
          if (playerPosition.isEqualTo({ x: xPosition, y: yPosition })) return `~Y${room.roomType}~e`;
          if (room.inventory.length > 0) return `~W${room.roomType}~e`;
          else return room.roomType;
        })
        .join("");
    });

    this.container.removeChildren();
    mapStringList.forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
