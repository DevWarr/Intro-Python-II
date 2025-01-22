import {
  randint,
  buildAdditionQuestion,
  buildSubtractionQuestion,
  buildDivisionQuestion,
  buildMultiplicationQuestion,
  buildExponentQuestion,
  buildRootQuestion,
} from "./guardianUtils";

const checkAnswersBetweenMinAndMax = (numArray: number[], min: number | bigint, max: number | bigint) => {
  expect(Math.max(...numArray)).toBeLessThanOrEqual(max);
  expect(Math.min(...numArray)).toBeGreaterThanOrEqual(min);
};

test("Random Int function returns a random number between min and max", () => {
  const expectedMin = 2;
  const expectedMax = 40;
  const testedArrayValues = Array(1_000)
    .fill(0)
    .map(() => randint(2, 40));

  checkAnswersBetweenMinAndMax(testedArrayValues, expectedMin, expectedMax);
});
describe("Addition function", () => {
  [
    {
      difficulty: 0,
      expectedMin: 0,
      expectedMax: 40,
    },
    {
      difficulty: 1,
      expectedMin: 18,
      expectedMax: 100,
    },
    {
      difficulty: 2,
      expectedMin: 30,
      expectedMax: 200,
    },
  ].forEach(({ difficulty, expectedMin, expectedMax }) => {
    test(`Returns an answer between ${expectedMin} and ${expectedMax} for ${difficulty} `, () => {
      const testAdditionAnswersArray = Array(1_000)
        .fill(0)
        .map(() => buildAdditionQuestion(difficulty)[1]);

      checkAnswersBetweenMinAndMax(testAdditionAnswersArray, expectedMin, expectedMax);
    });
  });
});
describe("Subtraction function", () => {
  [
    {
      difficulty: 0,
      expectedMin: 0,
      expectedMax: 20,
    },
    {
      difficulty: 1,
      expectedMin: 0,
      expectedMax: 41,
    },
    {
      difficulty: 2,
      expectedMin: 0,
      expectedMax: 85,
    },
  ].forEach(({ difficulty, expectedMin, expectedMax }) => {
    test(`Returns an answer between ${expectedMin} and ${expectedMax} for difficulty ${difficulty}`, () => {
      const testSubtractionAnswersArray = Array(1_000)
        .fill(0)
        .map(() => buildSubtractionQuestion(difficulty)[1]);

      checkAnswersBetweenMinAndMax(testSubtractionAnswersArray, expectedMin, expectedMax);
    });
  });
});
describe("Division function", () => {
  [
    {
      difficulty: 0,
      expectedMin: 2,
      expectedMax: 10,
    },
    {
      difficulty: 1,
      expectedMin: 2,
      expectedMax: 25,
    },
    {
      difficulty: 2,
      expectedMin: 2,
      expectedMax: 50,
    },
  ].forEach(({ difficulty, expectedMin, expectedMax }) => {
    test(`Returns an answer between ${expectedMin} and ${expectedMax} for difficulty ${difficulty}`, () => {
      const testDivisionAnswersArray = Array(1_000)
        .fill(0)
        .map(() => buildDivisionQuestion(difficulty)[1]);

      checkAnswersBetweenMinAndMax(testDivisionAnswersArray, expectedMin, expectedMax);
    });
  });
});
describe("Multiplication function", () => {
  [
    {
      difficulty: 0,
      expectedMin: 9,
      expectedMax: 81,
    },
    {
      difficulty: 1,
      expectedMin: 9,
      expectedMax: 196,
    },
    {
      difficulty: 2,
      expectedMin: 16,
      expectedMax: 400,
    },
  ].forEach(({ difficulty, expectedMin, expectedMax }) => {
    test(`Returns an answer between ${expectedMin} and ${expectedMax} for difficulty ${difficulty}`, () => {
      const testMultiplicationAnswersArray = Array(1_000)
        .fill(0)
        .map(() => buildMultiplicationQuestion(difficulty)[1]);

      checkAnswersBetweenMinAndMax(testMultiplicationAnswersArray, expectedMin, expectedMax);
    });
  });
});
describe("Square function", () => {
  test("Returns a perfect square between 4 and 25 for difficulty 0", () => {
    const expectedSquares = [4, 9, 16, 25];
    const expectedMax = expectedSquares[expectedSquares.length - 1];
    const expectedMin = expectedSquares[0];
    const testSquareAnswersArray = Array(1_000)
      .fill(0)
      .map(() => buildExponentQuestion(0)[1]);

    const invalidAnswers = testSquareAnswersArray.filter((num) => !expectedSquares.find((square) => square === num));
    expect(invalidAnswers).toHaveLength(0);
    expect(testSquareAnswersArray).toContain(expectedMax);
    expect(testSquareAnswersArray).toContain(expectedMin);
  });
  test("Returns a perfect square between 4 and 100 for difficulty 1", () => {
    const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const expectedMax = expectedSquares[expectedSquares.length - 1];
    const expectedMin = expectedSquares[0];
    const testSquareAnswersArray = Array(1_000)
      .fill(0)
      .map(() => buildExponentQuestion(1)[1]);

    const invalidAnswers = testSquareAnswersArray.filter((num) => !expectedSquares.find((square) => square === num));
    expect(invalidAnswers).toHaveLength(0);
    expect(testSquareAnswersArray).toContain(expectedMax);
    expect(testSquareAnswersArray).toContain(expectedMin);
  });
  test("Returns a perfect square or cube between 4 and 2197 for difficulty 2", () => {
    const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
    const expectedCubes = [8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197];
    const expectedAnswers = [...expectedSquares, ...expectedCubes];
    const expectedMax = expectedAnswers[expectedAnswers.length - 1];
    const expectedMin = expectedAnswers[0];
    const testSquareAnswersArray = Array(1_000)
      .fill(0)
      .map(() => buildExponentQuestion(2)[1]);

    const invalidAnswers = testSquareAnswersArray.filter((num) => !expectedAnswers.find((square) => square === num));
    expect(invalidAnswers).toHaveLength(0);
    expect(testSquareAnswersArray).toContain(expectedMax);
    expect(testSquareAnswersArray).toContain(expectedMin);
  });
  test("Formats question properly for a squared answer or cubes answer", () => {
    const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
    const expectedCubes = [8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197];
    const testSquareArray = Array(1_000)
      .fill(0)
      .map(() => buildExponentQuestion(2));

    const invalidAnswers = testSquareArray.filter(([question, answer]) => {
      if (question.match("cubed") !== null) {
        return !expectedCubes.find((num) => num === answer);
      } else {
        return !expectedSquares.find((num) => num === answer);
      }
    });
    expect(invalidAnswers).toHaveLength(0);
  });
});
describe("Root function", () => {
  test("Returns a perfect square root between 2 and 12 for difficulty 0", () => {
    const expectedMax = 12;
    const expectedMin = 2;
    const testRootAnswersArray = Array(1_000)
      .fill(0)
      .map(() => buildRootQuestion(0)[1]);

    checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax);
  });
  test("Returns a perfect square root between 8 and 15 for difficulty 1", () => {
    const expectedMax = 15;
    const expectedMin = 8;
    const testRootAnswersArray = Array(1_000)
      .fill(0)
      .map(() => buildRootQuestion(1)[1]);

    checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax);
  });
  test("Returns a perfect cube root between 2 and 7 for difficulty 1", () => {
    const expectedMax = 7;
    const expectedMin = 2;
    const testRootAnswersArray = Array(1_000)
      .fill(0)
      .map(() => buildRootQuestion(2)[1]);

    checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax);
  });
  test("Formats question properly for a cube root or square root answer", () => {
    const difficulty0QuestionsArray = Array(1_000)
      .fill(0)
      .map(() => buildRootQuestion(0)[0]);
    const difficulty1QuestionsArray = Array(1_000)
      .fill(0)
      .map(() => buildRootQuestion(1)[0]);
    const difficulty2QuestionsArray = Array(1_000)
      .fill(0)
      .map(() => buildRootQuestion(2)[0]);

    expect(difficulty0QuestionsArray).not.toContain("square");
    expect(difficulty1QuestionsArray).not.toContain("square");
    expect(difficulty2QuestionsArray).not.toContain("cube");
  });
});
