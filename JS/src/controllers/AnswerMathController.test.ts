import { Guardian, GuardianPose } from "../models/Guardians";
import { AnswerMathController } from "./AnswerMathController";

describe("AnswerMathController", () => {
  let answerMathController: AnswerMathController;
  let mockGuardian: Guardian;

  beforeEach(() => {
    jest.resetAllMocks();
    mockGuardian = {
      decrementTriesLeft: jest.fn(),
      removeCurrentQuestion: jest.fn(),
    } as unknown as Guardian;
    answerMathController = new AnswerMathController();
  });

  it("should return a validation response if the guardian isn't requesting a math answer", () => {
    // using reflection to set the property
    (mockGuardian as Record<string, any>).correctAnswer = "item";

    const response = answerMathController.answerMathQuestion(mockGuardian, 5);

    expect(response.guardianPose).toBe(GuardianPose.STAND);
    expect(response.responseToPlayer).toBe("~RYou shouldn't be doing math right now!");
  });

  it("should return a validation response if the answer is incorrect", () => {
    // using reflection to set the property
    (mockGuardian as Record<string, any>).correctAnswer = 10;

    const response = answerMathController.answerMathQuestion(mockGuardian, 5);

    expect(response.guardianPose).toBe(GuardianPose.INCORRECT);
    expect(response.responseToPlayer).toBe("~W5~R is not the correct answer!");
  });

  it("should decrement the guardian's tries left if the answer is incorrect", () => {
    // using reflection to set the property
    (mockGuardian as Record<string, any>).correctAnswer = 10;

    answerMathController.answerMathQuestion(mockGuardian, 5);

    expect(mockGuardian.decrementTriesLeft).toHaveBeenCalledTimes(1);
  });

  it("should return a success response if the answer is correct", () => {
    // using reflection to set the property
    (mockGuardian as Record<string, any>).correctAnswer = 10;

    const response = answerMathController.answerMathQuestion(mockGuardian, 10);

    expect(response.guardianPose).toBe(GuardianPose.CORRECT);
    expect(response.responseToPlayer).toBe("~W10~Y is correct!");
  });

  it("should remove the current question if the answer is correct", () => {
    // using reflection to set the property
    (mockGuardian as Record<string, any>).correctAnswer = 10;

    answerMathController.answerMathQuestion(mockGuardian, 10);

    expect(mockGuardian.removeCurrentQuestion).toHaveBeenCalledTimes(1);
  });
});
