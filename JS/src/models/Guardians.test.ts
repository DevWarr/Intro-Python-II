import {
  Guardian,
  MultipGuardian,
  GuardianName,
  GuardianQuestion,
  ArtifactGuardian,
  DividGuardian,
  RadicalGuardian,
  SquareGuardian,
} from "./Guardians";
import {
  buildAdditionQuestion,
  buildDivisionQuestion,
  buildExponentQuestion,
  buildMultiplicationQuestion,
  buildRootQuestion,
  buildSubtractionQuestion,
} from "./guardianUtils";

jest.mock("./guardianUtils");

class TestGuardian extends Guardian {
  public prepareQuestions(): void {
    this.guardianQuestions = [
      { mathAnswer: 1, mathQuestion: "question1" },
      { mathAnswer: 2, mathQuestion: "question2", itemPrerequisite: "item" },
    ];
  }
}

describe("Guardian tests", () => {
  const MOCK_GUARDIAN_QUESTION: GuardianQuestion = { mathAnswer: 1, mathQuestion: "question" };
  let testGuardian: Guardian;

  beforeEach(() => {
    jest.clearAllMocks();
    (buildAdditionQuestion as jest.Mock).mockReturnValue({ ...MOCK_GUARDIAN_QUESTION });
    (buildSubtractionQuestion as jest.Mock).mockReturnValue({ ...MOCK_GUARDIAN_QUESTION });
    (buildMultiplicationQuestion as jest.Mock).mockReturnValue({ ...MOCK_GUARDIAN_QUESTION });
    (buildExponentQuestion as jest.Mock).mockReturnValue({ ...MOCK_GUARDIAN_QUESTION });
    (buildDivisionQuestion as jest.Mock).mockReturnValue({ ...MOCK_GUARDIAN_QUESTION });
    (buildRootQuestion as jest.Mock).mockReturnValue({ ...MOCK_GUARDIAN_QUESTION });

    testGuardian = new TestGuardian(GuardianName.ARTIFACT, "Test");
    testGuardian.prepareQuestions();
  });

  test("decrementTriesLeft decreases the number of tries left", () => {
    expect(testGuardian.triesLeft).toEqual(3);

    testGuardian.decrementTriesLeft();

    expect(testGuardian.triesLeft).toEqual(2);
  });

  test("removeCurrentQuestion decreases the number of questions remaining", () => {
    expect(testGuardian.questionsRemaining).toEqual(2);

    testGuardian.removeCurrentQuestion();

    expect(testGuardian.questionsRemaining).toEqual(1);
  });

  test("getNextQuestion responds with the math question when there's no item prerequisite", () => {
    expect(testGuardian.getNextQuestion()).toEqual("question1");
  });

  test("getNextQuestion responds with a question for the item prerequisite if it exists", () => {
    // Removing the current question will give us the second question that DOES have an item pre-req
    testGuardian.removeCurrentQuestion();

    expect(testGuardian.getNextQuestion()).toContain("item");
  });

  test("die will set isAlive to false", () => {
    expect(testGuardian.isAlive).toBe(true);

    testGuardian.die();

    expect(testGuardian.isAlive).toBe(false);
  });

  [
    { guardian: new MultipGuardian(), expectedNumberOfQuestions: 5 },
    { guardian: new DividGuardian(), expectedNumberOfQuestions: 5 },
    { guardian: new SquareGuardian(), expectedNumberOfQuestions: 5 },
    { guardian: new RadicalGuardian(), expectedNumberOfQuestions: 5 },
    { guardian: new ArtifactGuardian(), expectedNumberOfQuestions: 10 },
  ].forEach(({ guardian, expectedNumberOfQuestions }) => {
    test(`${guardian.name} creates ${expectedNumberOfQuestions} guardian questions`, () => {
      guardian.prepareQuestions();

      expect(guardian.questionsRemaining).toEqual(expectedNumberOfQuestions);
    });
  });

  test("Multip guardian creates the correct questions with the correct difficulty", () => {
    const guardian = new MultipGuardian();

    guardian.prepareQuestions();

    expect(buildAdditionQuestion).toHaveBeenCalledTimes(5);
    const calls = (buildAdditionQuestion as jest.Mock).mock.calls;
    // Each array is the list of arguments passed into the function when it was called
    // In our case, we called the function with only one argument, so all of our calls are arrays of 1
    expect(calls).toEqual([[0], [0], [1], [2], [2]]);
  });

  test("Multip guardian creates the correct itemPrequisites in the correct order", () => {
    const guardian = new MultipGuardian();

    guardian.prepareQuestions();

    // Using casting to access the questions
    const guardianQuestions = (guardian as unknown as Record<string, GuardianQuestion[]>).guardianQuestions;
    guardianQuestions.forEach((question, index) => {
      if (index === 0) {
        expect(question.itemPrerequisite).toBe("Calculator");
      } else {
        expect(question.itemPrerequisite).toBe(undefined);
      }
    });
  });

  test("Divid guardian creates the correct questions with the correct difficulty", () => {
    const guardian = new DividGuardian();

    guardian.prepareQuestions();

    expect(buildSubtractionQuestion).toHaveBeenCalledTimes(5);
    const calls = (buildSubtractionQuestion as jest.Mock).mock.calls;
    expect(calls).toEqual([[0], [0], [1], [2], [2]]);
  });

  test("Divid guardian creates the correct itemPrequisites in the correct order", () => {
    const guardian = new DividGuardian();

    guardian.prepareQuestions();

    // Using casting to access the questions
    const guardianQuestions = (guardian as unknown as Record<string, GuardianQuestion[]>).guardianQuestions;
    const itemPrequisites = guardianQuestions.map((question) => question.itemPrerequisite);
    expect(itemPrequisites).toEqual(["Calculator", undefined, undefined, undefined, undefined]);
  });

  test("Square guardian creates the correct questions with the correct difficulty", () => {
    const guardian = new SquareGuardian();

    guardian.prepareQuestions();

    expect(buildAdditionQuestion).toHaveBeenCalledTimes(3);
    const additionCalls = (buildAdditionQuestion as jest.Mock).mock.calls;
    expect(additionCalls).toEqual([[0], [1], [2]]);

    expect(buildMultiplicationQuestion).toHaveBeenCalledTimes(2);
    const multiplicationCalls = (buildMultiplicationQuestion as jest.Mock).mock.calls;
    expect(multiplicationCalls).toEqual([[0], [2]]);
  });

  test("Square guardian creates the correct itemPrequisites in the correct order", () => {
    const guardian = new SquareGuardian();

    guardian.prepareQuestions();

    // Using casting to access the questions
    const guardianQuestions = (guardian as unknown as Record<string, GuardianQuestion[]>).guardianQuestions;
    const itemPrequisites = guardianQuestions.map((question) => question.itemPrerequisite);
    expect(itemPrequisites).toEqual(["Calculator", undefined, undefined, "Multip", undefined]);
  });

  test("Radical guardian creates the correct questions with the correct difficulty", () => {
    const guardian = new RadicalGuardian();

    guardian.prepareQuestions();

    expect(buildAdditionQuestion).toHaveBeenCalledTimes(1);
    expect(buildAdditionQuestion).toHaveBeenCalledWith(1);

    expect(buildSubtractionQuestion).toHaveBeenCalledTimes(1);
    expect(buildSubtractionQuestion).toHaveBeenCalledWith(2);

    expect(buildExponentQuestion).toHaveBeenCalledTimes(1);
    expect(buildExponentQuestion).toHaveBeenCalledWith(2);

    expect(buildDivisionQuestion).toHaveBeenCalledTimes(2);
    expect(buildDivisionQuestion).toHaveBeenCalledWith(1);
    expect(buildDivisionQuestion).toHaveBeenCalledWith(2);
  });

  test("Radical guardian creates the correct itemPrequisites in the correct order", () => {
    const guardian = new RadicalGuardian();

    guardian.prepareQuestions();

    // Using casting to access the questions
    const guardianQuestions = (guardian as unknown as Record<string, GuardianQuestion[]>).guardianQuestions;
    const itemPrequisites = guardianQuestions.map((question) => question.itemPrerequisite);
    expect(itemPrequisites).toEqual(["Calculator", undefined, "Square", "Divid", undefined]);
  });

  test("Artifact guardian creates the correct questions with the correct difficulty", () => {
    const guardian = new ArtifactGuardian();

    guardian.prepareQuestions();

    expect(buildMultiplicationQuestion).toHaveBeenCalledTimes(2);
    expect(buildMultiplicationQuestion).toHaveBeenCalledWith(2);
    expect(buildMultiplicationQuestion).toHaveBeenCalledWith(2);

    expect(buildExponentQuestion).toHaveBeenCalledTimes(2);
    expect(buildExponentQuestion).toHaveBeenCalledWith(1);
    expect(buildExponentQuestion).toHaveBeenCalledWith(2);

    expect(buildDivisionQuestion).toHaveBeenCalledTimes(2);
    expect(buildDivisionQuestion).toHaveBeenCalledWith(2);
    expect(buildDivisionQuestion).toHaveBeenCalledWith(2);

    expect(buildRootQuestion).toHaveBeenCalledTimes(2);
    expect(buildRootQuestion).toHaveBeenCalledWith(1);
    expect(buildRootQuestion).toHaveBeenCalledWith(2);

    expect(buildAdditionQuestion).toHaveBeenCalledTimes(1);
    expect(buildAdditionQuestion).toHaveBeenCalledWith(2);

    expect(buildSubtractionQuestion).toHaveBeenCalledTimes(1);
    expect(buildSubtractionQuestion).toHaveBeenCalledWith(2);
  });

  test("Artifact guardian creates the correct itemPrequisites in the correct order", () => {
    const guardian = new ArtifactGuardian();

    guardian.prepareQuestions();

    // Using casting to access the questions
    const guardianQuestions = (guardian as unknown as Record<string, GuardianQuestion[]>).guardianQuestions;
    const itemPrequisites = guardianQuestions.map((question) => question.itemPrerequisite);
    expect(itemPrequisites).toEqual([
      "Multip",
      undefined,
      "Square",
      undefined,
      "Divid",
      undefined,
      "Radical",
      undefined,
      "Calculator",
      undefined,
    ]);
  });
});
