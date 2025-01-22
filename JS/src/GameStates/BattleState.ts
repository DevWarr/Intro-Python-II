import { AnswerMathController } from "../controllers/AnswerMathController";
import { UseItemController } from "../controllers/UseItemController";
import { Guardian, GuardianPose } from "../models/Guardians";
import { Player } from "../models/Player";
import { BattleInfoContainer } from "../views/BattleInfoContainer";
import { GuardianPoseContainer } from "../views/GuardianPoseContainer";
import { GuardianQuestionContainer } from "../views/GuardianQuestionContainer";
import { ResponseContainer } from "../views/ResponseContainer";

export interface BattleStateActionResponse {
  guardianPose: GuardianPose;
  responseToPlayer: string;
}

export class BattleState {
  constructor(
    private player: Player,
    private guardian: Guardian,
    private guardianPoseContainer: GuardianPoseContainer,
    private battleInfoContainer: BattleInfoContainer,
    private guardianQuestionContainer: GuardianQuestionContainer,
    private responseContainer: ResponseContainer,
    private useItemController: UseItemController = new UseItemController(),
    private answerMathController: AnswerMathController = new AnswerMathController(),
  ) {
    this.guardian.prepareQuestions();
    this.updateRendering();
  }

  public updateRendering() {
    this.guardianPoseContainer.renderGuardian(this.guardian.name, GuardianPose.STAND);
    this.battleInfoContainer.renderBattleInfo(this.guardian.questionsRemaining, this.guardian.triesLeft);
    this.guardianQuestionContainer.renderGuardianQuestion(
      this.guardian.name,
      this.guardian.description,
      this.guardian.getNextQuestion(),
    );
  }

  public async processInput(inputString: string, resetInputCallback: () => void) {
    let actionResponse: BattleStateActionResponse;
    if (!isNaN(Number(inputString))) {
      actionResponse = this.answerMathController.answerMathQuestion(this.guardian, Number(inputString));
    } else if (inputString.split(" ")[0] === "use") {
      const itemToUse = inputString.split(" ")[1];
      actionResponse = this.useItemController.useItemInBattle(this.player, this.guardian, itemToUse);
    } else {
      actionResponse = {
        guardianPose: GuardianPose.STAND,
        responseToPlayer: "~eYou must ~Wuse ~c(item)~e, ~Wanswer~e the math problem, or ~Wrun away~e!",
      };
    }

    this.guardianPoseContainer.renderGuardian(this.guardian.name, actionResponse.guardianPose);
    if (actionResponse.guardianPose === GuardianPose.CORRECT) {
      this.guardian.removeCurrentQuestion();
      this.guardianQuestionContainer.renderGuardianQuestion(this.guardian.name, this.guardian.description, "");
    }
    await this.responseContainer.renderResponse(actionResponse.responseToPlayer);
    this.updateRendering();

    resetInputCallback();
  }
}
