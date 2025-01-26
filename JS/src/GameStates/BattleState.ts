import { AnswerMathController } from "../controllers/AnswerMathController";
import { UseItemController } from "../controllers/UseItemController";
import { SFXTrackNumber } from "../managers/AudioManager";
import { GameManager, GameStateType } from "../managers/GameManager";
import { Guardian, GuardianPose } from "../models/Guardians";
import { Player } from "../models/Player";
import { sleep } from "../utils/time";
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

  private async loseBattle() {
    this.responseContainer.renderResponseWithoutReset("~YYou lost the battle! You have to run away!");
    this.gameManager.audioManager.playSFX(SFXTrackNumber.DAMAGE);
    await sleep(0.5);
    this.gameManager.audioManager.playSFX(SFXTrackNumber.DAMAGE);
    await sleep(0.6);
    this.gameManager.audioManager.playSFX(SFXTrackNumber.DAMAGE);
    await sleep(0.8);
    this.player.runAway();
    await this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
  }

  public async processInput(inputString: string) {
    // If we're running away, just run. EZ
    if (inputString === "run away") {
      this.gameManager.audioManager.playSFX(SFXTrackNumber.RUN_AWAY);
      await this.responseContainer.renderResponse("~YYou ran away!");
      this.player.runAway();
      this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
      return;
    }

    // If we're not running away, we're either answering a math question or using an item
    // If we're answering a math question, we'll get a response from the answerMathController
    // If we're using an item, we'll get a response from the useItemController
    // If the input is invalid, we'll get a response from the else block
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

    // Update the guardian pose, the guardian question, and the response to the player
    //    based on the actionResponse
    this.guardianPoseContainer.renderGuardian(this.guardian.name, actionResponse.guardianPose);
    if (actionResponse.guardianPose === GuardianPose.CORRECT) {
      this.gameManager.audioManager.playSFX(SFXTrackNumber.CORRECT);
      this.guardianQuestionContainer.renderGuardianQuestion(this.guardian.name, this.guardian.description, "");
    }
    if (actionResponse.guardianPose === GuardianPose.INCORRECT) {
      this.gameManager.audioManager.playSFX(SFXTrackNumber.INCORRECT);
    }

    // MAKE SURE to update the battle info after the response is rendered
    // This way the battle info will be accurate as soon as the response is removed
    await this.responseContainer.renderResponse(actionResponse.responseToPlayer);
    this.battleInfoContainer.renderBattleInfo(this.guardian.questionsRemaining, this.guardian.triesLeft);

    // Determine if the battle is over
    // If the player wins, the guardian dies and the game goes back to exploration
    // If the guardian wins, the player runs away and the game goes back to exploration
    // If the battle is not over, update the rendering and continue the battle
    const battleWinner = this.getWinner();
    if (battleWinner === BattleWinner.GUARDIAN) {
      this.loseBattle();
    } else if (battleWinner === BattleWinner.PLAYER) {
      this.gameManager.audioManager.playSFX(SFXTrackNumber.MONSTER_DEATH);
      await this.responseContainer.renderResponse(`~YYou defeated the ~W${this.guardian.name}~Y!`);
      this.guardian.die();
      this.gameManager.changeGameStateType(GameStateType.EXPLORATION);
    } else {
      this.updateRendering();
    }
  }
}
