import { BattleStateActionResponse } from "../GameStates/BattleState";
import { ExplorationStateActionResponse } from "../GameStates/ExplorationState";
import { Guardian, GuardianPose } from "../models/Guardians";
import { Player } from "../models/Player";
import { Room, RoomType } from "../models/Room";

export class UseItemController {
  private capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  public useItemInRoom(player: Player, room: Room, itemName?: string): ExplorationStateActionResponse {
    const isRoomEntrance = room.roomType === RoomType.ENTRANCE;
    const isItemArtifact = itemName === "artifact";

    let actionSuccess: boolean = false;
    let responseToPlayer: string = "";

    if (!itemName || itemName === "") {
      responseToPlayer = "~RPlease type the ~c(name)~R of the item you wish to use.";
    } else if (!player.inventory.hasItem(itemName)) {
      responseToPlayer = `~c(${itemName})~R is not in your inventory.`;
    } else if (!isRoomEntrance && !isItemArtifact) {
      responseToPlayer = `~RYou can't use the ~c(${this.capitalizeFirstLetter(itemName)})~R outside of battle.`;
    } else if (isRoomEntrance && !isItemArtifact) {
      responseToPlayer = `~RThe ~c(${this.capitalizeFirstLetter(itemName)})~R isn't the right item to use here.`;
    } else if (!isRoomEntrance && isItemArtifact) {
      responseToPlayer = `~RYou can't use the ~c(${this.capitalizeFirstLetter(itemName)})~R in this room.`;
    } else {
      responseToPlayer = `~GYou escaped the Cave!`;
      actionSuccess = true;
    }

    return {
      actionSuccess,
      responseToPlayer,
    };
  }

  public useItemInBattle(player: Player, guardian: Guardian, itemName?: string): BattleStateActionResponse {
    if (!itemName || itemName === "") {
      return {
        guardianPose: GuardianPose.STAND,
        responseToPlayer: "~RPlease type the ~c(name)~R of the item you wish to use.",
      };
    }

    // If the player doesn't have the item
    if (!player.inventory.hasItem(itemName)) {
      return {
        guardianPose: GuardianPose.STAND,
        responseToPlayer: `~RYou do not have ~c(${itemName})~R!`,
      };
    }

    // If we should be answering as a number
    if (!isNaN(Number(guardian.correctAnswer))) {
      return {
        guardianPose: GuardianPose.STAND,
        responseToPlayer: `~RYou can't use an item right now.`,
      };
    }

    // If the item is incorrect, that's a wrong answer!
    if (itemName !== guardian.correctAnswer) {
      guardian.decrementTriesLeft();
      return {
        guardianPose: GuardianPose.INCORRECT,
        responseToPlayer: `~c(${itemName})~R is not the correct item!`,
      };
    }

    guardian.removeCurrentQuestion();
    return {
      guardianPose: GuardianPose.CORRECT,
      responseToPlayer: `~YYou used ~c(${this.capitalizeFirstLetter(itemName)})~Y!`,
    };
  }
}
