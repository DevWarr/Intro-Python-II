const { test, describe, expect } = require('@jest/globals');
const { randint, addition, subtraction, division, multiplication, square, root } = require('./guardianUtils');

const confirmTypesForQuestionAndAnswer = (func) =>
    test('Returns a question and answer', () => {
        const [question, answer] = func();

        expect(typeof question).toEqual('string');
        expect(typeof answer).toEqual('number');
    });

const checkAnswersBetweenMinAndMax = (numArray, min, max) => {
    expect(Math.max(...numArray)).toBeLessThanOrEqual(max);
    expect(Math.min(...numArray)).toBeGreaterThanOrEqual(min);
    expect(numArray).toContain(max);
    expect(numArray).toContain(min);
};

describe('Guardian Utility Functions', () => {
    test('Random Int function returns a random number between min and max', () => {
        const expectedMin = 2;
        const expectedMax = 40;
        const testedArrayValues = Array(100000)
            .fill(0)
            .map(() => randint(2, 40));

        checkAnswersBetweenMinAndMax(testedArrayValues, expectedMin, expectedMax);
    });
    describe('Addition function', () => {
        confirmTypesForQuestionAndAnswer(addition);
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
                const testAdditionAnswersArray = Array(100000)
                    .fill(0)
                    .map(() => addition(difficulty)[1]);

                checkAnswersBetweenMinAndMax(testAdditionAnswersArray, expectedMin, expectedMax);
            });
        });
    });
    describe('Subtraction function', () => {
        confirmTypesForQuestionAndAnswer(subtraction);
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
                const testSubtractionAnswersArray = Array(100000)
                    .fill(0)
                    .map(() => subtraction(difficulty)[1]);

                checkAnswersBetweenMinAndMax(testSubtractionAnswersArray, expectedMin, expectedMax);
            });
        });
    });
    describe('Division function', () => {
        confirmTypesForQuestionAndAnswer(division);
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
                const testDivisionAnswersArray = Array(100000)
                    .fill(0)
                    .map(() => division(difficulty)[1]);

                checkAnswersBetweenMinAndMax(testDivisionAnswersArray, expectedMin, expectedMax);
            });
        });
    });
    describe('Multiplication function', () => {
        confirmTypesForQuestionAndAnswer(multiplication);
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
                const testMultiplicationAnswersArray = Array(100000)
                    .fill(0)
                    .map(() => multiplication(difficulty)[1]);

                checkAnswersBetweenMinAndMax(testMultiplicationAnswersArray, expectedMin, expectedMax);
            });
        });
    });
    describe('Square function', () => {
        confirmTypesForQuestionAndAnswer(square);
        test('Returns a perfect square between 4 and 25 for difficulty 0', () => {
            const expectedSquares = [4, 9, 16, 25];
            const expectedMax = expectedSquares[expectedSquares.length - 1];
            const expectedMin = expectedSquares[0];
            const testSquareAnswersArray = Array(100000)
                .fill(0)
                .map(() => square(0)[1]);

            testSquareAnswersArray.map((num) => expect(expectedSquares).toContain(num));
            expect(testSquareAnswersArray).toContain(expectedMax);
            expect(testSquareAnswersArray).toContain(expectedMin);
        });
        test('Returns a perfect square between 4 and 100 for difficulty 1', () => {
            const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            const expectedMax = expectedSquares[expectedSquares.length - 1];
            const expectedMin = expectedSquares[0];
            const testSquareAnswersArray = Array(100000)
                .fill(0)
                .map(() => square(1)[1]);

            testSquareAnswersArray.map((num) => expect(expectedSquares).toContain(num));
            expect(testSquareAnswersArray).toContain(expectedMax);
            expect(testSquareAnswersArray).toContain(expectedMin);
        });
        test('Returns a perfect square or cube between 4 and 2197 for difficulty 2', () => {
            const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
            const expectedCubes = [8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197];
            const expectedAnswers = [...expectedSquares, ...expectedCubes];
            const expectedMax = expectedAnswers[expectedAnswers.length - 1];
            const expectedMin = expectedAnswers[0];
            const testSquareAnswersArray = Array(100000)
                .fill(0)
                .map(() => square(2)[1]);

            testSquareAnswersArray.map((num) => expect(expectedAnswers).toContain(num));
            expect(testSquareAnswersArray).toContain(expectedMax);
            expect(testSquareAnswersArray).toContain(expectedMin);
        });
        test('Formats question properly for a squared answer or cubes answer', () => {
            const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
            const expectedCubes = [8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197];
            const testSquareArray = Array(100000)
                .fill(0)
                .map(() => square(2));

            testSquareArray.map(([question, answer]) => {
                if (question.match('cubed') !== null) {
                    expect(expectedCubes).toContain(answer);
                } else {
                    expect(expectedSquares).toContain(answer);
                }
            });
        });
    });
    describe('Root function', () => {
        confirmTypesForQuestionAndAnswer(root);
        test('Returns a perfect square root between 2 and 12 for difficulty 0', () => {
            const expectedMax = 12;
            const expectedMin = 2;
            const testRootAnswersArray = Array(100000)
                .fill(0)
                .map(() => root(0)[1]);

            checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax);
        });
        test('Returns a perfect square root between 8 and 15 for difficulty 1', () => {
            const expectedMax = 15;
            const expectedMin = 8;
            const testRootAnswersArray = Array(100000)
                .fill(0)
                .map(() => root(1)[1]);

            checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax);
        });
        test('Returns a perfect cube root between 2 and 7 for difficulty 1', () => {
            const expectedMax = 7;
            const expectedMin = 2;
            const testRootAnswersArray = Array(100000)
                .fill(0)
                .map(() => root(2)[1]);

            checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax);
        });
        test('Formats question properly for a cube root or square root answer', () => {
            const difficulty0QuestionsArray = Array(100000)
                .fill(0)
                .map(() => root(0)[0]);
            const difficulty1QuestionsArray = Array(100000)
                .fill(0)
                .map(() => root(1)[0]);
            const difficulty2QuestionsArray = Array(100000)
                .fill(0)
                .map(() => root(2)[0]);

            expect(difficulty0QuestionsArray).not.toContain('square');
            expect(difficulty1QuestionsArray).not.toContain('square');
            expect(difficulty2QuestionsArray).not.toContain('cube');
        });
    });
});
