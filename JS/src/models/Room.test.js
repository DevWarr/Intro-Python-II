const { test, describe, expect } = require('@jest/globals');
const { Guardian } = require('./Guardians');

const { Room, Shrine } = require('./Room');

describe('Room', () => {
    test('Room creation has the proper name, description, and inventory', () => {
        const inventory = [1, 2, 3];
        const testRoom = new Room('testRoom', 'testDescription', inventory);
    
        expect(testRoom.name).toEqual('testRoom');
        expect(testRoom.description).toEqual('testDescription');
        expect(testRoom.inventory).toEqual(inventory);
    });
    
    test('Room successfully removes and returns item from inventory', () => {
        const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
        const returnedItem = testRoom.remove_from_inventory('4');
    
        expect(testRoom.inventory.length).toEqual(1);
        expect(testRoom.inventory[0].name).toEqual('1');
        expect(returnedItem.name).toEqual('4');
    });
    
    test('Room returns null and removes nothing if the item is not found in inventory', () => {
        const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
        const returnedItem = testRoom.remove_from_inventory('17');
    
        expect(testRoom.inventory.length).toEqual(2);
        expect(returnedItem).toEqual(null);
    });
    
    test('Room successfully adds an item to inventory', () => {
        const testRoom = new Room('testRoom', 'testDescription', [{ name: '1' }, { name: '4' }]);
        testRoom.add_to_inventory({ name: '2' });
        const expectedInventoryIndex = 2;
    
        expect(testRoom.inventory.length).toEqual(3);
        expect(testRoom.inventory[expectedInventoryIndex].name).toEqual('2');
    });
})

describe('Shrine', () => {
    test("Creating a Shrine with a Guardian adds the Shrine to the Guardian's attributes", () => {
        const testGuardian = new Guardian('testGuardian', 'testDescription')
        const testShrine = new Shrine('testShrine', 'testDescription', [], testGuardian)

        expect(testShrine.guardian).toBe(testGuardian)
        expect(testGuardian.shrine).toBe(testShrine)
    })
    test("adding a Guardian to a Shrine adds the Shrine to the Guardian's attributes", () => {
        const testGuardian = new Guardian('testGuardian', 'testDescription')
        const testShrine = new Shrine('testShrine', 'testDescription', [])
        
        expect(testShrine.guardian).toBe(null)
        
        testShrine.guardian = testGuardian
        
        expect(testShrine.guardian).toBe(testGuardian)
        expect(testGuardian.shrine).toBe(testShrine)
    })
})