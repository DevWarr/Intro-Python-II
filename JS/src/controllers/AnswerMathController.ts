import { BattleStateActionResponse } from "../GameStates/BattleState";
import { Guardian, GuardianPose } from "../models/Guardians";

export class AnswerMathController {
  public answerMathQuestion(guardian: Guardian, mathResponse: number): BattleStateActionResponse {
    // If we should be using an item
    if (isNaN(Number(guardian.correctAnswer))) {
      return {
        guardianPose: GuardianPose.STAND,
        responseToPlayer: `~RYou shouldn't be doing math right now!`,
      };
    }

    // If the item is incorrect, that's a wrong answer!
    if (mathResponse !== guardian.correctAnswer) {
      guardian.decrementTriesLeft();
      return {
        guardianPose: GuardianPose.INCORRECT,
        responseToPlayer: `~W${mathResponse}~R is not the correct answer!`,
      };
    }

    guardian.removeCurrentQuestion();
    return {
      guardianPose: GuardianPose.CORRECT,
      responseToPlayer: `~W${mathResponse}~Y is correct!`,
    };
  }
}
