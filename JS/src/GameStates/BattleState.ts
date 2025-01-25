import { AnswerMathController } from "../controllers/AnswerMathController";
import { UseItemController } from "../controllers/UseItemController";
import { GameManager, GameStateType } from "../GameManager";
import { Guardian, GuardianPose } from "../models/Guardians";
import { Player } from "../models/Player";
import { BattleInfoContainer } from "../views/BattleInfoContainer";
import { ControlsContainer, ControlType } from "../views/ControlsContainer";
import { GuardianPoseContainer } from "../views/GuardianPoseContainer";
import { GuardianQuestionContainer } from "../views/GuardianQuestionContainer";
import { ResponseContainer } from "../views/ResponseContainer";
import { GameState } from "./GameState";

export interface BattleStateActionResponse {
  guardianPose: GuardianPose;
  responseToPlayer: string;
}

enum BattleWinner {
  PLAYER,
  GUARDIAN,
  NONE,
}

export class BattleState implements GameState {
  constructor(
    private gameManager: GameManager,
    private player: Player,
    private guardian: Guardian,
    private guardianPoseContainer: GuardianPoseContainer,
    private battleInfoContainer: BattleInfoContainer,
    private guardianQuestionContainer: GuardianQuestionContainer,
    private controlsContainer: ControlsContainer,
    private responseContainer: ResponseContainer,
    private useItemController: UseItemController = new UseItemController(),
    private answerMathController: AnswerMathController = new AnswerMathController(),
  ) {
    this.guardian.prepareQuestions();
  }

  public startRendering() {
    this.guardianPoseContainer.container.alpha = 1;
    this.battleInfoContainer.container.alpha = 1;
    this.guardianQuestionContainer.container.alpha = 1;

    this.controlsContainer.renderControlType(ControlType.BATTLE);
    this.updateRendering();
  }

  public stopRendering() {
    this.guardianPoseContainer.container.alpha = 0;
    this.battleInfoContainer.container.alpha = 0;
    this.guardianQuestionContainer.container.alpha = 0;
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

  private getWinner(): BattleWinner {
    if (this.guardian.questionsRemaining === 0) return BattleWinner.PLAYER;
    if (this.guardian.triesLeft === 0) return BattleWinner.GUARDIAN;
    else return BattleWinner.NONE;
  }

  public async processInput(inputString: string) {
    if (inputString === "run away") {
      await this.responseContainer.renderResponse("~YYou ran away!");
      this.player.runAway();
      this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
      return;
    }

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

    const battleWinner = this.getWinner();
    if (battleWinner === BattleWinner.GUARDIAN) {
      await this.responseContainer.renderResponse("~YYou lost the battle! You have to run away!");
      this.player.runAway();
      this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
    } else if (battleWinner === BattleWinner.PLAYER) {
      await this.responseContainer.renderResponse(`~YYou defeated the ~W${this.guardian.name}~Y!`);
      this.guardian.die();
      this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
    } else {
      this.updateRendering();
    }
  }
}
