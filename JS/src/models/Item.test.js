const { describe, assertEquals } = require('../utils/testFunction');

const { Item } = require('./Item');

describe('Item tests', [
	{
		'item creation has the proper name and description': () => {
			const itemName = 'Test Item';
			const itemDescription = 'A wonderful item!';
			const newItem = new Item('Test Item', 'A wonderful item!');

			assertEquals(newItem.toString(), itemName);
			assertEquals(newItem.name, itemName);
			assertEquals(newItem.description, itemDescription);
		},
	},

	{
		'item creation has no description if not given': () => {
			const itemName = 'Test Item';
			const newItem = new Item('Test Item');

			assertEquals(newItem.toString(), itemName);
			assertEquals(newItem.name, itemName);
			assertEquals(newItem.description, '');
		},
	},
]);
