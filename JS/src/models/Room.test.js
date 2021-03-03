const assert = require('assert').strict;
const test = require('../utils/testFunction');

const { Room } = require('./Room');

(async function () {
	await test('Room creation has the proper name, description, and inventory', () => {
		const inventory = [1, 2, 3];
		const testRoom = new Room('testRoom', 'testDescription', inventory);

		assert.equal(testRoom.name, 'testRoom');
		assert.equal(testRoom.description, 'testDescription');
		assert.equal(testRoom.inventory, inventory);
	});

	await test('Room successfully removes an item from inventory', () => {
		const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
		testRoom.remove_from_inventory('4');

		assert.equal(testRoom.inventory.length, 1);
		assert.equal(testRoom.inventory[0].name, '1');
	});

	await test('Room successfully adds an item to inventory', () => {
		const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
		testRoom.add_to_inventory({ name: '2' });
		const expectedInventoryIndex = 2;

		assert.equal(testRoom.inventory.length, 3);
		assert.equal(testRoom.inventory[expectedInventoryIndex].name, '2');
	});
})();
