import { BattleStateActionResponse } from "../GameStates/BattleState";
import { Guardian, GuardianPose } from "../models/Guardians";
import { Player } from "../models/Player";

export class UseItemController {
  private capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  public useItemInRoom() {}

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

    return {
      guardianPose: GuardianPose.CORRECT,
      responseToPlayer: `~YYou used ~c(${this.capitalizeFirstLetter(itemName)})~Y!`,
    };
  }
}
