import { Room, RoomType, Shrine } from "./Room";
import { Item } from "./Item";
import {
  MultipGuardian,
  DividGuardian,
  SquareGuardian,
  RadicalGuardian,
  ArtifactGuardian,
  Guardian,
} from "./Guardians";
import { PositionVector2 } from "./PositionVector2";

// 0 -> Entrance
// 1 -> Tunnel
// 2 -> Multip
// 3 -> Divid
// 4 -> Square
// 5 -> Radical
// 6 -> Artifact
const MAP_TEMPLATE: number[][] = [
  [2, 7, 7, 1, 1],
  [1, 1, 1, 1, 3],
  [1, 7, 4, 7, 1],
  [1, 5, 7, 7, 1],
  [1, 0, 7, 6, 1],
];

interface RoomTemplate {
  name: string;
  description: string;
  roomType: RoomType;
  inventory?: Item[];
  guardian?: Guardian;
}

const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    name: "Entrance",
    description: "Return here with the mathematical artifact. Use it to escape this maze!",
    roomType: RoomType.ENTRANCE,
  },

  {
    name: "Tunnel",
    description: "Nothing extravagant. An Empty tunnel.",
    roomType: RoomType.TUNNEL,
  },

  {
    name: "Multip Shrine",
    description: "The Shrine of the Multip sign, granting the power of multiplication.",
    roomType: RoomType.SHRINE,
    inventory: [new Item("Multip")],
    guardian: new MultipGuardian(),
  },
  {
    name: "Divid Shrine",
    description: "The Shrine of the Divid sign, granting the power of division.",
    roomType: RoomType.SHRINE,
    inventory: [new Item("Divid")],
    guardian: new DividGuardian(),
  },
  {
    name: "Square Shrine",
    description: "The Shrine of the Square sign, granting the power of squaring.",
    roomType: RoomType.SHRINE,
    inventory: [new Item("Square")],
    guardian: new SquareGuardian(),
  },
  {
    name: "Radical Shrine",
    description: "The Shrine of the Radical sign, granting the power of square and cube rooting.",
    roomType: RoomType.SHRINE,
    inventory: [new Item("Radical")],
    guardian: new RadicalGuardian(),
  },
  {
    name: "Artifact Shrine",
    description: "The Shrine of the Ancient Mathematical Artifact! Grab it, and get out of here!",
    roomType: RoomType.ARTIFACT,
    inventory: [new Item("Artifact")],
    guardian: new ArtifactGuardian(),
  },
];

export const DEBUG_MAP = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
];

/**
 * Creates a map like this:
 * ```
 * [S]      [ ][ ]
 * [ ][ ][ ][ ][S]
 * [ ]   [S]   [ ]
 * [ ][S]      [ ]
 * [ ][X]   [A][ ]
 * ```
 * - S = shrine
 * - A = Artifact Room
 * - X = Cave Entrance.
 */
export class GameMap {
  map: (Room | null)[][];
  entrance: Room;

  constructor(template: number[][] = MAP_TEMPLATE, entraceRoomPosition: PositionVector2 = new PositionVector2(1, 4)) {
    this.map = this.createMap(template);
    this.entrance = this.map[entraceRoomPosition.y][entraceRoomPosition.x]!;
  }

  private createMap = (template: number[][]) => {
    return template.map((rowOfRooms: number[]) =>
      rowOfRooms.map((roomId: number) => {
        const roomInfo = ROOM_TEMPLATES[roomId];

        if (!roomInfo) return null;

        // If there is something in index three, there's a guardian
        // Ergo, we must make a shrine instead of a room
        if (roomInfo.guardian) {
          return new Shrine(roomInfo.name, roomInfo.description, roomInfo.guardian, roomInfo.inventory);
        } else return new Room(roomInfo.name, roomInfo.description, roomInfo.roomType, roomInfo.inventory);
      }),
    );
  };

  public getRoomAtPosition(roomPosition: PositionVector2): Room | null {
    return this.map[roomPosition.y]?.[roomPosition.x] ?? null;
  }
}
