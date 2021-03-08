const { Room, Shrine } = require('./Room');
const { Item } = require('./Item');
const { MultipGuardian, DividGuardian, SquareGuardian, RadicalGuardian, ArtifactGuardian } = require('./Guardians');

// 0 -> Entrance
// 1 -> Tunnel
// 2 -> Multip
// 3 -> Divid
// 4 -> Square
// 5 -> Radical
// 6 -> Artifact
const MAP_TEMPLATE = [
    [2, 7, 7, 1, 1],
    [1, 1, 1, 1, 3],
    [1, 7, 4, 7, 1],
    [1, 5, 7, 7, 1],
    [1, 0, 7, 6, 1],
];
const ROOM_TEMPLATES = [
    ['Entrance', 'Return here with the mathematical artifact. Use it to escape this maze!'],
    ['Tunnel', 'Nothing extravagant. An Empty tunnel.'],
    [
        'Multip Shrine',
        'The Shrine of the Multip sign, granting the power of multiplication.',
        [new Item('Multip')],
        new MultipGuardian(),
    ],
    [
        'Divid Shrine',
        'The Shrine of the Divid sign, granting the power of division.',
        [new Item('Divid')],
        new DividGuardian(),
    ],
    [
        'Square Shrine',
        'The Shrine of the Square sign, granting the power of squaring.',
        [new Item('Square')],
        new SquareGuardian(),
    ],
    [
        'Radical Shrine',
        'The Shrine of the Radical sign, granting the power of square and cube rooting.',
        [new Item('Radical')],
        new RadicalGuardian(),
    ],
    [
        'Artifact Shrine',
        'The Shrine of the Ancient Mathematical Artifact! Grab it, and get out of here!',
        [new Item('Artifact')],
        new ArtifactGuardian(),
    ],
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
class GameMap {
    constructor() {
        this.map = this.createMap();
        this.entrance = this.map[4][1];
    }

    createMap = (self) => {
        return MAP_TEMPLATE.map((rowOfRooms) =>
            rowOfRooms.map((roomId) => {
                const roomInfo = ROOM_TEMPLATES[roomId];

                if (!roomInfo) return null;

                // If there is something in index three, there's a guardian
                // Ergo, we must make a shrine instead of a room
                if (roomInfo[3]) {
                    return new Shrine(...roomInfo);
                } else return new Room(...roomInfo);
            })
        );
    };
}

module.exports = {
    GameMap,
};
