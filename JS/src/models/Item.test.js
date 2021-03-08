const { test, describe, expect } = require('@jest/globals');

const { Item } = require('./Item');

describe('Item tests', () => {
    test('item creation has the proper name and description', () => {
        const itemName = 'Test Item';
        const itemDescription = 'A wonderful item!';
        const newItem = new Item('Test Item', 'A wonderful item!');

        expect(newItem.toString()).toEqual(itemName);
        expect(newItem.name).toEqual(itemName);
        expect(newItem.description).toEqual(itemDescription);
    });

    test('item creation has no description if not given', () => {
        const itemName = 'Test Item';
        const newItem = new Item('Test Item');

        expect(newItem.toString()).toEqual(itemName);
        expect(newItem.name).toEqual(itemName);
        expect(newItem.description).toEqual('');
    });
});
