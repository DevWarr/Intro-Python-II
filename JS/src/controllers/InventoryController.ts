import { ExplorationStateActionResponse } from "../GameStates/ExplorationState";
import { Player } from "../models/Player";
import { Room } from "../models/Room";

export class InventoryController {
  public takeItem(room: Room, player: Player, itemName?: string): ExplorationStateActionResponse {
    if (!itemName || itemName === "") {
      return {
        actionSuccess: false,
        responseToPlayer: "~RPlease type the ~c(name)~R of the item you wish to take.",
      };
    }

    if (!room.inventory.hasItem(itemName)) {
      return {
        actionSuccess: false,
        responseToPlayer: `~c(${itemName})~R is not in the room.`,
      };
    }

    if (player.inventory.isFull) {
      return {
        actionSuccess: false,
        responseToPlayer: "~RYour inventory is full.",
      };
    }

    // We checked if the room has the item above, so we can perform the non-nullable check here
    const item = room.inventory.removeFromInventory(itemName)!;
    player.inventory.addToInventory(item);
    return {
      actionSuccess: true,
      responseToPlayer: `You took ~c(${item.name})~e.`,
    };
  }

  public dropItem(room: Room, player: Player, itemName?: string): ExplorationStateActionResponse {
    if (!itemName || itemName === "") {
      return {
        actionSuccess: false,
        responseToPlayer: "~RPlease type the ~c(name)~R of the item you wish to drop.",
      };
    }

    if (!player.inventory.hasItem(itemName)) {
      return {
        actionSuccess: false,
        responseToPlayer: `~c(${itemName})~R is not in your inventory.`,
      };
    }

    if (room.inventory.isFull) {
      return {
        actionSuccess: false,
        responseToPlayer: "~RThe room cannot hold any more items.",
      };
    }

    // We checked if the room has the item above, so we can perform the non-nullable check here
    const item = player.inventory.removeFromInventory(itemName)!;
    room.inventory.addToInventory(item);
    return {
      actionSuccess: true,
      responseToPlayer: `You dropped ~c(${item.name})~e.`,
    };
  }
}
