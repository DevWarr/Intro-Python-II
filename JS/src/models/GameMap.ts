import { Room, Shrine } from "./Room";
import { Item } from "./Item";
import {
  MultipGuardian,
  DividGuardian,
  SquareGuardian,
  RadicalGuardian,
  ArtifactGuardian,
  Guardian,
} from "./Guardians";

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
  inventory?: Item[];
  guardian?: Guardian;
}

const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    name: "Entrance",
    description: "Return here with the mathematical artifact. Use it to escape this maze!",
  },
  { name: "Tunnel", description: "Nothing extravagant. An Empty tunnel." },
  {
    name: "Multip Shrine",
    description: "The Shrine of the Multip sign, granting the power of multiplication.",
    inventory: [new Item("Multip")],
    guardian: new MultipGuardian(),
  },
  {
    name: "Divid Shrine",
    description: "The Shrine of the Divid sign, granting the power of division.",
    inventory: [new Item("Divid")],
    guardian: new DividGuardian(),
  },
  {
    name: "Square Shrine",
    description: "The Shrine of the Square sign, granting the power of squaring.",
    inventory: [new Item("Square")],
    guardian: new SquareGuardian(),
  },
  {
    name: "Radical Shrine",
    description: "The Shrine of the Radical sign, granting the power of square and cube rooting.",
    inventory: [new Item("Radical")],
    guardian: new RadicalGuardian(),
  },
  {
    name: "Artifact Shrine",
    description: "The Shrine of the Ancient Mathematical Artifact! Grab it, and get out of here!",
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

  constructor(template: number[][] = MAP_TEMPLATE) {
    this.map = this.createMap(template);
    this.entrance = this.map[4][1]!;
  }

  createMap = (template: number[][]) => {
    return template.map((rowOfRooms: number[]) =>
      rowOfRooms.map((roomId: number) => {
        const roomInfo = ROOM_TEMPLATES[roomId];

        if (!roomInfo) return null;

        // If there is something in index three, there's a guardian
        // Ergo, we must make a shrine instead of a room
        if (roomInfo.guardian) {
          return new Shrine(roomInfo.name, roomInfo.description, roomInfo.inventory, roomInfo.guardian);
        } else return new Room(roomInfo.name, roomInfo.description, roomInfo.inventory);
      }),
    );
  };
}
