const { Item } = require('./Item');
const { Shrine } = require('./Room');
const { GameMap } = require('./GameMap');

const ENTRANCE_ROOM = {
    x: 1,
    y: 4,
};

class Player {
    /**
     *
     * @param {string} name
     * @param {GameMap} gameMap
     * @param {Item[]} inv
     */
    constructor(name, gameMap, inv = []) {
        this.name = name;
        this.gameMap = gameMap;
        this.position = [ENTRANCE_ROOM.y, ENTRANCE_ROOM.x]; // [y, x]
        this.prev = null;
        this.__inv = inv;
        this.__maxInv = 4;
    }

    get x() {
        return this.position[1];
    }

    get y() {
        return this.position[0];
    }

    /**Returns the Room object the player is currently in*/
    get currentRoom() {
        return this.gameMap.map[this.y][this.x];
    }

    get inv() {
        return [...this.__inv];
    }

    /**
     * Add's an item to the inventory.
     *
     * If the item would make the inventory too large,
     * returns false.
     *
     * Else, adds item and returns true.
     */
    addToInv(item) {
        if (this.__inv.length >= this.__maxInv) {
            return false;
        } else {
            this.__inv.push(item);
            return true;
        }
    }

    /**
     * If possible, retrieves item from player inventory.
     * Casing does not matter.
     *
     * If the item is found, returns the item.
     *
     * Else, returns null.
     */
    getFromInv(name) {
        return this.__inv.find(item => item.name.toLowerCase() === name.toLowerCase())
    }

    /**
     * If possible, removes item from player inventory.
     * Casing does not matter.
     *
     * If the item is found, removes the item
     * from the inventory and returns the item.
     *
     * Else, returns null.
     */
    removeFromInv(name) {
        const indexOfItem = this.__inv.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
        if (indexOfItem > -1) {
            const [item] = this.__inv.splice(indexOfItem, 1);
            return item;
        }
        return null;
    }

    /**
     * If possible,
     * Takes an item from the current room
     * And adds to the player inventory
     */
    takeItem(name) {
        const room = this.currentRoom;
        const item = room.removeFromInventory(name);

        if (item === null) {
            return [null, name];
        }
        const success = this.addToInv(item);

        if (!success) {
            // If we can't add the item to our inventory,
            //     (Inventory may be too large)
            // Then return the item to the room
            room.addToInventory(item);
            return [false, item.name];
        } else {
            return [true, item.name];
        }
    }

    /**
     * If possible,
     * Removes item from player inventory
     * And adds to current room.
     */
    dropItem(name) {
        const item = this.removeFromInv(name);
        if (item === null) {
            return [null, name];
        } else {
            const room = this.currentRoom;
            room.addToInventory(item);
            return [true, item.name];
        }
    }

    /**
     * Uses an item in the Player's inventory.
     *
     * Only used to end the game.
     * The item must be the Artifact,
     * and the player must be in the Entrance Room.
     *
     * If:
     * - Player doesn't have item → (null, name)
     * - Above conditions are met → (true, item.name).
     * - Else                     → (false, item.name).
     */
    useItem(name) {
        const item = this.getFromInv(name);
        if (!item) {
            return [null, name];
        }
        if (item.name === 'Artifact' && this.y === ENTRANCE_ROOM.y && this.x === ENTRANCE_ROOM.x) {
            return [true, item.name];
        } else {
            return [false, item.name];
        }
    }

    /**
     * Confirms that our new direction is both
     *  -   in range
     *  -   A valid room
     * This could be done all in one if statement,
     * But the y, x, and valid room checks are
     *  separated for readability.
     */
    _confirmDirection(y, x) {
        if (this.gameMap.map[y]) {
            return !!this.gameMap.map[y][x];
        }
    }

    /**
     * Confirming each direction and making sure we stay in bounds,
     * moves a direction and stores previous location.
     *
     * Returns true if we moved, and false otherwise
     */
    move(direction) {
        if (direction === 'n' && this._confirmDirection(this.y - 1, this.x)) {
            this.prev = [...this.position];
            this.position[0] -= 1;
            return true;
        } else if (direction === 's' && this._confirmDirection(this.y + 1, this.x)) {
            this.prev = [...this.position];
            this.position[0] += 1;
            return true;
        } else if (direction === 'w' && this._confirmDirection(this.y, this.x - 1)) {
            this.prev = [...this.position];
            this.position[1] -= 1;
            return true;
        } else if (direction === 'e' && this._confirmDirection(this.y, this.x + 1)) {
            this.prev = [...this.position];
            this.position[1] += 1;
            return true;
        } else {
            return false;
        }
    }

    runAway() {
        this.position = [...this.prev];
    }

    /**
     * Checks if a guardian is in the current room.
     *
     * If there is a guardian, returns the guardian.
     * Else, returns null.
     */
    checkForGuardian() {
        if (this.currentRoom instanceof Shrine) {
            return this.currentRoom.guardian;
        }
    }
}

class GamePlayer extends Player {
    constructor(name, gameMap) {
        super(name, gameMap, [new Item('Calculator', 'Simple Calculator. Can add and subtract.')]);
    }
}

class DebugPlayer extends Player {
    constructor(name) {
        inventory = [
            new Item('Calculator', 'Simple Calculator. Can add and subtract.'),
            new Item('Artifact', 'Simple Calculator. Can add and subtract.'),
        ];
        super(name, null, inventory);
    }
}

module.exports = {
    Player,
    GamePlayer,
    DebugPlayer,
};
