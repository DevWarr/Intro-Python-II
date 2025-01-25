import { Item } from "../models/Item";
import { Player } from "../models/Player";
import { Room } from "../models/Room";
import { InventoryController } from "./InventoryController";

describe("InventoryController", () => {
  let inventoryController: InventoryController;
  let mockRoom: Room;
  let mockPlayer: Player;

  beforeEach(() => {
    jest.resetAllMocks();
    mockRoom = {
      inventory: {
        hasItem: jest.fn(),
        removeFromInventory: jest.fn(),
        addToInventory: jest.fn(),
        isFull: false,
      },
    } as unknown as Room;
    mockPlayer = {
      inventory: {
        hasItem: jest.fn(),
        removeFromInventory: jest.fn(),
        addToInventory: jest.fn(),
        isFull: false,
      },
    } as unknown as Player;
    inventoryController = new InventoryController();
  });

  describe("takeItem", () => {
    it("should return a validation response if the item name is missing", () => {
      const response = inventoryController.takeItem(mockRoom, mockPlayer);

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RPlease type the ~c(name)~R of the item you wish to take.");
    });

    it("should return a validation response if the item is not in the room", () => {
      (mockRoom.inventory.hasItem as jest.Mock).mockReturnValue(false);

      const response = inventoryController.takeItem(mockRoom, mockPlayer, "item");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~c(item)~R is not in the room.");
    });

    it("should return a validation response if the player's inventory is full", () => {
      (mockRoom.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockPlayer.inventory as Record<string, any>).isFull = true;

      const response = inventoryController.takeItem(mockRoom, mockPlayer, "item");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RYour inventory is full.");
    });

    it("should return a success response if the item is taken", () => {
      (mockRoom.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockPlayer.inventory as Record<string, any>).isFull = false;
      (mockRoom.inventory.removeFromInventory as jest.Mock).mockReturnValue({
        name: "item",
      });

      const response = inventoryController.takeItem(mockRoom, mockPlayer, "item");

      expect(response.actionSuccess).toBe(true);
      expect(response.responseToPlayer).toBe("You took ~c(item)~e.");
    });

    it("should update inventories if the item is taken", () => {
      (mockRoom.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockPlayer.inventory as Record<string, any>).isFull = false;

      const item = { name: "item" } as unknown as Item;
      (mockRoom.inventory.removeFromInventory as jest.Mock).mockReturnValue(item);

      inventoryController.takeItem(mockRoom, mockPlayer, "item");

      expect(mockRoom.inventory.removeFromInventory).toHaveBeenCalledWith("item");
      expect(mockPlayer.inventory.addToInventory).toHaveBeenCalledWith(item);
    });
  });

  describe("drop item", () => {
    it("should return a validation response if the item name is missing", () => {
      const response = inventoryController.dropItem(mockRoom, mockPlayer);

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RPlease type the ~c(name)~R of the item you wish to drop.");
    });

    it("should return a validation response if the item is not in the player's inventory", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(false);

      const response = inventoryController.dropItem(mockRoom, mockPlayer, "item");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~c(item)~R is not in your inventory.");
    });

    it("should return a validation response if the room's inventory is full", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockRoom.inventory as Record<string, any>).isFull = true;

      const response = inventoryController.dropItem(mockRoom, mockPlayer, "item");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RThe room cannot hold any more items.");
    });

    it("should return a success response if the item is dropped", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockRoom.inventory as Record<string, any>).isFull = false;
      (mockPlayer.inventory.removeFromInventory as jest.Mock).mockReturnValue({
        name: "item",
      });

      const response = inventoryController.dropItem(mockRoom, mockPlayer, "item");

      expect(response.actionSuccess).toBe(true);
      expect(response.responseToPlayer).toBe("You dropped ~c(item)~e.");
    });

    it("should update inventories if the item is dropped", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockRoom.inventory as Record<string, any>).isFull = false;

      const item = { name: "item" } as unknown as Item;
      (mockPlayer.inventory.removeFromInventory as jest.Mock).mockReturnValue(item);

      inventoryController.dropItem(mockRoom, mockPlayer, "item");

      expect(mockPlayer.inventory.removeFromInventory).toHaveBeenCalledWith("item");
      expect(mockRoom.inventory.addToInventory).toHaveBeenCalledWith(item);
    });
  });
});
