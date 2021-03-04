const { describe, assertEquals } = require('../utils/testFunction');

const { Room } = require('./Room');

describe('Room tests', [
	{
		'Room creation has the proper name, description, and inventory': () => {
			const inventory = [1, 2, 3];
			const testRoom = new Room('testRoom', 'testDescription', inventory);

			assertEquals(testRoom.name, 'testRoom');
			assertEquals(testRoom.description, 'testDescription');
			assertEquals(testRoom.inventory, inventory);
		},
	},
	{
		'Room successfully removes and returns item from inventory': () => {
			const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
			const returnedItem = testRoom.remove_from_inventory('4');

			assertEquals(testRoom.inventory.length, 1);
			assertEquals(testRoom.inventory[0].name, '1');
			assertEquals(returnedItem.name, '4');
		},
	},
	{
		'Room returns null and removes nothing if the item is not found in inventory': () => {
			const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
			const returnedItem = testRoom.remove_from_inventory('17');

			assertEquals(testRoom.inventory.length, 2);
			assertEquals(returnedItem, null);
		},
	},
	{
		'Room successfully adds an item to inventory': () => {
			const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
			testRoom.add_to_inventory({ name: '2' });
			const expectedInventoryIndex = 2;

			assertEquals(testRoom.inventory.length, 3);
			assertEquals(testRoom.inventory[expectedInventoryIndex].name, '2');
		},
	},
]);
