const assert = require('assert').strict;
const { describe } = require('../utils/testFunction');

const { Item } = require('./Item');

describe('Item tests', [
	{
		'item creation has the proper name and description': () => {
			const itemName = 'Test Item';
			const itemDescription = 'A wonderful item!';
			const newItem = new Item('Test Item', 'A wonderful item!');

			assert.equal(newItem.toString(), itemName);
			assert.equal(newItem.name, itemName);
			assert.equal(newItem.description, itemDescription);
		},
	},

	{
		'item creation has no description if not given': () => {
			const itemName = 'Test Item';
			const newItem = new Item('Test Item');

			assert.equal(newItem.toString(), itemName);
			assert.equal(newItem.name, itemName);
			assert.equal(newItem.description, '');
		},
	},
]);
