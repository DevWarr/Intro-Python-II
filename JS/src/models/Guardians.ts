import {
  buildAdditionQuestion,
  buildSubtractionQuestion,
  buildDivisionQuestion,
  buildMultiplicationQuestion,
  buildExponentQuestion,
  buildRootQuestion,
} from "./guardianUtils";

export enum GuardianPose {
  STAND = "stand",
  CORRECT = "correct",
  INCORRECT = "incorrect",
}

export enum GuardianName {
  MULTIP = "Multip Guardian",
  DIVID = "Divid Guardian",
  SQUARE = "Square Guardian",
  RADICAL = "Radical Guardian",
  ARTIFACT = "Artifact Guardian",
}

export interface GuardianQuestion {
  mathQuestion: string;
  mathAnswer: number;
  itemPrerequisite?: string;
}

/**Parent Guardian Class. All Guardians derive from this class. */
export abstract class Guardian {
  constructor(
    readonly name: GuardianName,
    readonly description: string,

    private __triesLeft: number = 3,
    private __isAlive: boolean = true,
    protected guardianQuestions: GuardianQuestion[] = [],
  ) {}

  get triesLeft() {
    return this.__triesLeft;
  }

  public decrementTriesLeft() {
    this.__triesLeft--;
  }

  get questionsRemaining() {
    return this.guardianQuestions.length;
  }

  /** Removes the current guardian question, also decrementing the total number of questions */
  public removeCurrentQuestion() {
    if (this.guardianQuestions[0].itemPrerequisite) {
      this.guardianQuestions[0].itemPrerequisite = undefined;
    } else {
      this.guardianQuestions.shift();
    }
  }

  /**
   * Returns the expected player response
   *
   * This could be a number or a string depending on
   * whether the player needs to use an item or answer a math question.
   */
  get correctAnswer(): string | number {
    const currentQuestion = this.guardianQuestions[0];

    return currentQuestion.itemPrerequisite?.toLowerCase() ?? currentQuestion.mathAnswer;
  }

  get isAlive() {
    return this.__isAlive;
  }

  public die() {
    this.__isAlive = false;
  }

  /**
   * Returns the question to display to the player.
   *
   * If there's no question, we'll create one here.
   *
   * If there's a required item, that becomes our question.
   * Otherwise, our question is a math question
   */
  public getNextQuestion() {
    if (this.guardianQuestions[0].itemPrerequisite) {
      return `~W${this.name}~e is requesting you use ~c(${this.guardianQuestions[0].itemPrerequisite})`;
    } else return this.guardianQuestions[0].mathQuestion;
  }

  /**
   * Resets the user's tries.
   *
   * This function SHOULD also set the guardianQuestions.
   */
  public prepareQuestions() {
    this.__triesLeft = 3;
  }
}

/**Asks addition questions. Drops the Multip sign.*/
export class MultipGuardian extends Guardian {
  constructor() {
    super(GuardianName.MULTIP, "Guardian of the Multip Shrine. Keep your guard!");
  }

  /**
   * Creates questions in this order:
   * - 1st → addition(easy), requires calculator
   * - 2nd → addition(easy)
   * - 3rd → addition(med)
   * - 4th → addition(hard)
   * - 5th → addition(hard)
   */
  public prepareQuestions(): void {
    super.prepareQuestions();
    this.guardianQuestions = [
      { ...buildAdditionQuestion(0), itemPrerequisite: "Calculator" },
      buildAdditionQuestion(0),
      buildAdditionQuestion(1),
      buildAdditionQuestion(2),
      buildAdditionQuestion(2),
    ];
  }
}

export class DividGuardian extends Guardian {
  constructor() {
    super(GuardianName.DIVID, "Guardian of the Divid Shrine. Keep it sleek, slick.");
  }

  /**
   * Creates questions in this order:
   * - 1st → subtraction(easy), requires calculator
   * - 2nd → subtraction(easy)
   * - 3rd → subtraction(med)
   * - 4th → subtraction(hard)
   * - 5th → subtraction(hard)
   */
  public prepareQuestions(): void {
    super.prepareQuestions();
    this.guardianQuestions = [
      { ...buildSubtractionQuestion(0), itemPrerequisite: "Calculator" },
      buildSubtractionQuestion(0),
      buildSubtractionQuestion(1),
      buildSubtractionQuestion(2),
      buildSubtractionQuestion(2),
    ];
  }
}

export class SquareGuardian extends Guardian {
  constructor() {
    super(GuardianName.SQUARE, "Guardian of the Square Shrine. Stay happy, stay civil!");
  }

  /**
   * Creates questions in this order:
   * - 1st → addition(easy), requires calculator
   * - 2nd → addition(med)
   * - 3rd → addition(hard)
   * - 4th → multiplication(easy), requires Multip
   * - 5th → multiplication(hard)
   */
  public prepareQuestions(): void {
    super.prepareQuestions();
    this.guardianQuestions = [
      { ...buildAdditionQuestion(0), itemPrerequisite: "Calculator" },
      buildAdditionQuestion(1),
      buildAdditionQuestion(2),
      { ...buildMultiplicationQuestion(0), itemPrerequisite: "Multip" },
      buildMultiplicationQuestion(2),
    ];
  }
}

export class RadicalGuardian extends Guardian {
  constructor() {
    super(GuardianName.RADICAL, "Guardian of the Radical Shrine. Radical!!!");
  }

  /**
   * Creates questions in this order:
   * - 1st → addition(med), requires calculator
   * - 2nd → subtraction(hard)
   * - 3rd → square(hard), requires Square
   * - 4th → divide(med), requires Divid
   * - 5th → divide(hard)
   */
  public prepareQuestions(): void {
    super.prepareQuestions();
    this.guardianQuestions = [
      { ...buildAdditionQuestion(1), itemPrerequisite: "Calculator" },
      buildSubtractionQuestion(2),
      { ...buildExponentQuestion(2), itemPrerequisite: "Square" },
      { ...buildDivisionQuestion(1), itemPrerequisite: "Divid" },
      buildDivisionQuestion(2),
    ];
  }
}

/**
 * The artifact Guardian holds it's own questions and tries.
 * You can run away and the question count won't go down.
 */
export class ArtifactGuardian extends Guardian {
  constructor() {
    super(GuardianName.ARTIFACT, "The final challenge! If you run away, your questions won't get reset.");
  }

  /**
   * Creates questions in this order:
   * - 1st  → multiplication(hard), requires Multip
   * - 2nd  → multiplication(hard)
   * - 3rd  → square(med), requires Square
   * - 4th  → square(hard)
   * - 5th  → division(hard), requires Divid
   * - 6th  → division(hard)
   * - 7th  → root(med), requires Radical
   * - 8th  → root(hard)
   * - 9th  → addition(hard), requires calculator
   * - 10th → subtraction(hard)
   */
  public prepareQuestions(): void {
    super.prepareQuestions();
    if (this.guardianQuestions.length !== 0) {
      // The artifact guardian doesn't reset its questions.
      // Ergo, if there are already questions on the guardian then we don't do anything.
      return;
    }
    this.guardianQuestions = [
      { ...buildMultiplicationQuestion(2), itemPrerequisite: "Multip" },
      buildMultiplicationQuestion(2),
      { ...buildExponentQuestion(1), itemPrerequisite: "Square" },
      buildExponentQuestion(2),
      { ...buildDivisionQuestion(2), itemPrerequisite: "Divid" },
      buildDivisionQuestion(2),
      { ...buildRootQuestion(1), itemPrerequisite: "Radical" },
      buildRootQuestion(2),
      { ...buildAdditionQuestion(2), itemPrerequisite: "Calculator" },
      buildSubtractionQuestion(2),
    ];
  }
}
