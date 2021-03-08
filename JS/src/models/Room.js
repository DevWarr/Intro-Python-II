const { Item } = require('./Item');
const { Guardian } = require('./Guardians');

class Room {
    /**
     *
     * @param {string} name
     * @param {string} description
     * @param {Item[]} inventory
     */
    constructor(name, description, inventory = []) {
        this.name = name;
        this.description = description;
        this.inventory = inventory;
    }

    /**
     * If possible, removes item from room.
     * Casing does not matter.
     *
     * @param {string} name
     *
     * @returns {null | Item} The item removed from the room inventory, or null.
     */
    remove_from_inventory(name) {
        let item = null;
        const itemIndex = this.inventory.findIndex((item) => item.name.toLowerCase() === name);
        if (itemIndex > -1) {
            item = this.inventory[itemIndex];
            this.inventory.splice(itemIndex, 1);
        }
        return item;
    }

    /**
     *
     * @param {Item} item
     */
    add_to_inventory(item) {
        this.inventory.push(item);
    }
}
class Shrine extends Room {
    /**
     *
     * @param {string} name
     * @param {string} description
     * @param {Item[]} inventory
     * @param {Guardian | null} guardian
     */
    constructor(name, description, inventory = [], guardian = null) {
        super(name, description, inventory);
        this.__guardian = guardian;
        if (this.__guardian != null) {
            this.__guardian.shrine = this;
        }
    }

    get guardian() {
        return this.__guardian;
    }

    set guardian(guardian) {
        if (guardian) {
            guardian.shrine = this;
        }
        this.__guardian = guardian;
    }
}

const debugRoom = new Room(
    "You're an explorer, you see!",
    'Search through the Mathematical Caves, find the Artifact, and make your escape!',
    [new Item('Please resize'), new Item('So you can see'), new Item('All of'), new Item('This text')]
);

module.exports = {
    Room,
    Shrine,
    debugRoom,
};
