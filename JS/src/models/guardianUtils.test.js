const assert = require('assert').strict;
const {
	describe,
	assertIncludes,
	assertLessThanOrEqualTo,
	assertGreaterThanOrEqualTo,
} = require('../utils/testFunction');

const { randint, addition, subtraction, division, multiplication, square, root } = require('./guardianUtils');

const confirmTypesForQuestionAndAnswer = (func) => {
	return {
		'Returns a question and answer': () => {
			const [question, answer] = func();

			assert.equal(typeof question, 'string');
			assert.equal(typeof answer, 'number');
		},
	};
};

const checkAnswersBetweenMinAndMax = (numArray, min, max) => {
	numArray.map((answer) => {
		assertLessThanOrEqualTo(answer, max);
		assertGreaterThanOrEqualTo(answer, min);
	});
	assertIncludes(numArray, max);
	assertIncludes(numArray, min);
};

describe('Guardian Utility Functions', [
	{
		'Random Int function': [
			{
				'Returns a random number between min and max': () => {
					const expectedRandoms = [2, 3, 4, 5];
					const testedArrayValues = Array(100000)
						.fill(0)
						.map(() => randint(2, 5));

					testedArrayValues.map((val) => {
						assertIncludes(expectedRandoms, val);
					});
				},
			},
			{
				'Includes the minimum number': () => {
					const minimum = 5;
					const testedArrayValues = Array(100000)
						.fill(0)
						.map(() => randint(minimum, 24));

					assertIncludes(testedArrayValues, minimum);
				},
			},
			{
				'Includes the maximum number': () => {
					const maximum = 50;
					const testedArrayValues = Array(100000)
						.fill(0)
						.map(() => randint(5, maximum));

					assertIncludes(testedArrayValues, maximum);
				},
			},
		],
	},
	{
		'Addition function': [
			confirmTypesForQuestionAndAnswer(addition),
			{
				'Returns an answer between 0 and 40 for difficulty 0': () => {
					const expectedMax = 40;
					const expectedMin = 0;
					const testAdditionAnswersArray = Array(100000)
						.fill(0)
						.map(() => addition(0)[1]);

					checkAnswersBetweenMinAndMax(testAdditionAnswersArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 18 and 100 for difficulty 1': () => {
					const expectedMax = 100;
					const expectedMin = 18;
					const testAdditionAnswersArray = Array(100000)
						.fill(0)
						.map(() => addition(1)[1]);

					checkAnswersBetweenMinAndMax(testAdditionAnswersArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 30 and 200 for difficulty 2': () => {
					const expectedMax = 200;
					const expectedMin = 30;
					const testAdditionAnswersArray = Array(100000)
						.fill(0)
						.map(() => addition(2)[1]);

					checkAnswersBetweenMinAndMax(testAdditionAnswersArray, expectedMin, expectedMax);
				},
			},
		],
	},
	{
		'Subtraction function': [
			confirmTypesForQuestionAndAnswer(subtraction),
			{
				'Returns an answer between 0 and 20 for difficulty 0': () => {
					const expectedMax = 20;
					const expectedMin = 0;
					const testSubtractionArray = Array(100000)
						.fill(0)
						.map(() => subtraction(0)[1]);

					checkAnswersBetweenMinAndMax(testSubtractionArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 0 and 41 for difficulty 1': () => {
					const expectedMax = 41;
					const expectedMin = 0;
					const testSubtractionArray = Array(100000)
						.fill(0)
						.map(() => subtraction(1)[1]);

					checkAnswersBetweenMinAndMax(testSubtractionArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 0 and 85 for difficulty 2': () => {
					const expectedMax = 85;
					const expectedMin = 0;
					const testSubtractionArray = Array(100000)
						.fill(0)
						.map(() => subtraction(2)[1]);

					checkAnswersBetweenMinAndMax(testSubtractionArray, expectedMin, expectedMax);
				},
			},
		],
	},
	{
		'Division function': [
			confirmTypesForQuestionAndAnswer(division),
			{
				'Returns an answer between 2 and 10 for difficulty 0': () => {
					const expectedMax = 10;
					const expectedMin = 2;
					const testDivisionArray = Array(100000)
						.fill(0)
						.map(() => division(0)[1]);

					checkAnswersBetweenMinAndMax(testDivisionArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 2 and 25 for difficulty 1': () => {
					const expectedMax = 25;
					const expectedMin = 2;
					const testDivisionArray = Array(100000)
						.fill(0)
						.map(() => division(1)[1]);

					checkAnswersBetweenMinAndMax(testDivisionArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 2 and 50 for difficulty 2': () => {
					const expectedMax = 50;
					const expectedMin = 2;
					const testDivisionArray = Array(100000)
						.fill(0)
						.map(() => division(2)[1]);

					checkAnswersBetweenMinAndMax(testDivisionArray, expectedMin, expectedMax);
				},
			},
		],
	},
	{
		'Multiplication function': [
			confirmTypesForQuestionAndAnswer(multiplication),
			{
				'Returns an answer between 9 and 81 for difficulty 0': () => {
					const expectedMax = 81;
					const expectedMin = 9;
					const testMultiplicationArray = Array(100000)
						.fill(0)
						.map(() => multiplication(0)[1]);

					checkAnswersBetweenMinAndMax(testMultiplicationArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 9 and 196 for difficulty 1': () => {
					const expectedMax = 196;
					const expectedMin = 9;
					const testMultiplicationArray = Array(100000)
						.fill(0)
						.map(() => multiplication(1)[1]);

					checkAnswersBetweenMinAndMax(testMultiplicationArray, expectedMin, expectedMax);
				},
			},
			{
				'Returns an answer between 16 and 400 for difficulty 2': () => {
					const expectedMax = 400;
					const expectedMin = 16;
					const testMultiplicationArray = Array(100000)
						.fill(0)
						.map(() => multiplication(2)[1]);

					checkAnswersBetweenMinAndMax(testMultiplicationArray, expectedMin, expectedMax);
				},
			},
		],
	},
	{
		'Square function': [
			confirmTypesForQuestionAndAnswer(square),
			{
				'Returns a perfect square between 4 and 25 for difficulty 0': () => {
					const expectedSquares = [4, 9, 16, 25];
					const expectedMax = expectedSquares[expectedSquares.length - 1];
					const expectedMin = expectedSquares[0];
					const testSquareAnswersArray = Array(100000)
						.fill(0)
						.map(() => square(0)[1]);

					testSquareAnswersArray.map((num) => assertIncludes(expectedSquares, num));
					assertIncludes(testSquareAnswersArray, expectedMax);
					assertIncludes(testSquareAnswersArray, expectedMin);
				},
			},
			{
				'Returns a perfect square between 4 and 100 for difficulty 1': () => {
					const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
					const expectedMax = expectedSquares[expectedSquares.length - 1];
					const expectedMin = expectedSquares[0];
					const testSquareAnswersArray = Array(100000)
						.fill(0)
						.map(() => square(1)[1]);

					testSquareAnswersArray.map((num) => assertIncludes(expectedSquares, num));
					assertIncludes(testSquareAnswersArray, expectedMax);
					assertIncludes(testSquareAnswersArray, expectedMin);
				},
			},
			{
				'Returns a perfect square or cube between 4 and 2197 for difficulty 2': () => {
					const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
					const expectedCubes = [8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197];
					const expectedAnswers = [...expectedSquares, ...expectedCubes];
					const expectedMax = expectedAnswers[expectedAnswers.length - 1];
					const expectedMin = expectedAnswers[0];
					const testSquareAnswersArray = Array(100000)
						.fill(0)
						.map(() => square(2)[1]);

					testSquareAnswersArray.map((num) => assertIncludes(expectedAnswers, num));
					assertIncludes(testSquareAnswersArray, expectedMax);
					assertIncludes(testSquareAnswersArray, expectedMin);
				},
			},
			{
				'Formats question properly for a squared answer or cubes answer': () => {
					const expectedSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
					const expectedCubes = [8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197];
					const testSquareArray = Array(100000)
						.fill(0)
						.map(() => square(2));

					testSquareArray.map(([question, answer]) => {
						if (question.match('cubed') !== null) {
							assertIncludes(expectedCubes, answer)
						}
						else {
							assertIncludes(expectedSquares, answer)
						}
					})
				}
			},
		],
	},
	{
		'Root function': [
			confirmTypesForQuestionAndAnswer(root),
			{
				'Returns a perfect square root between 2 and 12 for difficulty 0': () => {
					const expectedMax = 12;
					const expectedMin = 2;
					const testRootAnswersArray = Array(100000)
						.fill(0)
						.map(() => root(0)[1]);

					checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax)
				},
			},
			{
				'Returns a perfect square root between 8 and 15 for difficulty 1': () => {
					const expectedMax = 15;
					const expectedMin = 8;
					const testRootAnswersArray = Array(100000)
						.fill(0)
						.map(() => root(1)[1]);

					checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax)
				},
			},
			{
				'Returns a perfect cube root between 2 and 7 for difficulty 1': () => {
					const expectedMax = 7;
					const expectedMin = 2;
					const testRootAnswersArray = Array(100000)
						.fill(0)
						.map(() => root(2)[1]);

					checkAnswersBetweenMinAndMax(testRootAnswersArray, expectedMin, expectedMax)
				},
			},
			{
				'Formats question properly for a cube root or square root answer': () => {
					const difficulty0QuestionsArray = Array(100000)
						.fill(0)
						.map(() => root(0)[0]);
					const difficulty1QuestionsArray = Array(100000)
						.fill(0)
						.map(() => root(1)[0]);
					const difficulty2QuestionsArray = Array(100000)
						.fill(0)
						.map(() => root(2)[0]);

					difficulty0QuestionsArray.map(question => assert.match(question, /square/i))
					difficulty1QuestionsArray.map(question => assert.match(question, /square/i))
					difficulty2QuestionsArray.map(question => assert.match(question, /cube/i))
				}
			},
		],
	},
]);
