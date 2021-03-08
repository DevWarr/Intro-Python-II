const { test, describe, expect, beforeEach } = require('@jest/globals');

const {
    Guardian,
    MultipGuardian,
    DividGuardian,
    SquareGuardian,
    RadicalGuardian,
    ArtifactGuardian,
    testing: { STAND, CORRECT, INCORRECT, NotImplementedError },
} = require('./Guardians');

const guardianUtils = require('./guardianUtils');
jest.mock('./guardianUtils', () => ({
    addition: jest.fn(() => ['Q', 'A']),
    subtraction: jest.fn(() => ['Q', 'A']),
    division: jest.fn(() => ['Q', 'A']),
    multiplication: jest.fn(() => ['Q', 'A']),
    square: jest.fn(() => ['Q', 'A']),
    root: jest.fn(() => ['Q', 'A']),
}));

const createTestGuardian = () => new Guardian('testName', 'testDescription');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Base Guardian Class', () => {
    test('Guardian creation stores proper attributes', () => {
        const expectedName = 'testName';
        const expectedDescription = 'testDescription';
        const expectedTryCount = 3;
        const expectedQuestionCount = 5;
        const expectedPose = STAND;
        const expectedRequiredItem = 'Calculator';

        const testGuardian = createTestGuardian();

        expect(testGuardian.name).toEqual(expectedName);
        expect(testGuardian.description).toEqual(expectedDescription);
        expect(testGuardian.tryCount).toEqual(expectedTryCount);
        expect(testGuardian.questionCount).toEqual(expectedQuestionCount);
        expect(testGuardian.pose).toEqual(expectedPose);
        expect(testGuardian.requiredItem).toEqual(expectedRequiredItem);
    });
    test('prepQuiz() resets the tryCount, questionCount, and requiredItem', () => {
        const expectedTryCount = 3;
        const expectedQuestionCount = 5;
        const expectedRequiredItem = 'Calculator';

        const testGuardian = createTestGuardian();
        testGuardian.tryCount = 0;
        testGuardian.questionCount = 2;
        testGuardian.requiredItem = null;
        testGuardian.prepQuiz();

        expect(testGuardian.tryCount).toEqual(expectedTryCount);
        expect(testGuardian.questionCount).toEqual(expectedQuestionCount);
        expect(testGuardian.requiredItem).toEqual(expectedRequiredItem);
    });
    test('confirm mathQuestion() and nextQuestionPrep() are not implemented for this base class', () => {
        const testGuardian = new Guardian('testName, testDescription');

        expect(testGuardian.mathQuestion).toThrow(NotImplementedError);
        expect(testGuardian.nextQuestionPrep).toThrow(NotImplementedError);
    });
    describe('createQuestion()', () => {
        test('sets the question to the required item if an item is required', () => {
            const testGuardian = createTestGuardian();
            testGuardian.requiredItem = 'testItem';

            testGuardian.createQuestion();

            expect(testGuardian.question).toMatch(/\(testItem\)/i);
        });
        test('tries calling mathQuestion if no requiredItem is set', () => {
            const testGuardian = createTestGuardian();
            testGuardian.requiredItem = null;

            jest.spyOn(testGuardian, 'mathQuestion');
            testGuardian.mathQuestion.mockImplementation(() => true);

            testGuardian.createQuestion();
            expect(testGuardian.mathQuestion).toHaveBeenCalledTimes(1);
        });
        test('does not change the question if there already is one', () => {
            const testGuardian = createTestGuardian();
            testGuardian.question = 'testQuestion';

            testGuardian.createQuestion();

            expect(testGuardian.question).toEqual('testQuestion');
        });
    });
    describe('checkItem()', () => {
        test("sets the 'CORRECT' pose, resets the requiredItem and question, and returns true if the item matches the requiredItem", () => {
            const testGuardian = createTestGuardian();
            testGuardian.requiredItem = 'testItem';

            expect(testGuardian.checkItem('testItem')).toEqual(true);
            expect(testGuardian.answer).toEqual(null);
            expect(testGuardian.question).toEqual(null);
            expect(testGuardian.pose).toEqual(CORRECT);
        });
        test("sets the 'INCORRECT' pose, decrements the tryCount, and returns false if the item matches the requiredItem", () => {
            const testGuardian = createTestGuardian();
            testGuardian.requiredItem = 'testItem';
            expectedTryCount = 2;

            expect(testGuardian.checkItem('wrongItem')).toEqual(false);
            expect(testGuardian.tryCount).toEqual(expectedTryCount);
            expect(testGuardian.pose).toEqual(INCORRECT);
        });
    });
    describe('checkAnswer()', () => {
        test("sets answer and question to null, sets pose to 'CORRECT', calls nextQuestionPrep, and returns true if the answer is correct", () => {
            const testGuardian = createTestGuardian();
            testGuardian.answer = 25;

            jest.spyOn(testGuardian, 'nextQuestionPrep');
            testGuardian.nextQuestionPrep.mockImplementation(() => null);

            expect(testGuardian.checkAnswer(25)).toEqual(true);

            expect(testGuardian.answer).toEqual(null);
            expect(testGuardian.question).toEqual(null);
            expect(testGuardian.pose).toEqual(CORRECT);
            expect(testGuardian.nextQuestionPrep).toHaveBeenCalledTimes(1);
        });
        test("decrements the tryCount, sets pose to 'INCORRECT', and returns false if the answer is wrong", () => {
            const testGuardian = createTestGuardian();
            testGuardian.tryCount = 3;
            testGuardian.answer = 25;

            expect(testGuardian.checkAnswer(20)).toEqual(false);

            expect(testGuardian.pose).toEqual(INCORRECT);
            expect(testGuardian.tryCount).toEqual(2);
        });
    });
    describe('checkVictory()', () => {
        test('returns false if tryCount is at zero', () => {
            const testGuardian = createTestGuardian();
            testGuardian.tryCount = 0;

            expect(testGuardian.checkVictory()).toEqual(false);
        });
        test('returns true if questionCount is at zero', () => {
            const testGuardian = createTestGuardian();
            testGuardian.questionCount = 0;

            expect(testGuardian.checkVictory()).toEqual(true);
        });
        test('returns null if neither the tryCount nor questionCount are at zero', () => {
            const testGuardian = createTestGuardian();
            testGuardian.tryCount = 3;
            testGuardian.questionCount = 5;

            expect(testGuardian.checkVictory()).toEqual(null);
        });
    });
});

describe('Multip Guardian', () => {
    describe('mathQuestion()', () => {
        [
            {
                questionCount: 5,
                expectedDifficulty: 0,
                functionToCall: 'addition',
            },
            {
                questionCount: 4,
                expectedDifficulty: 0,
                functionToCall: 'addition',
            },
            {
                questionCount: 3,
                expectedDifficulty: 1,
                functionToCall: 'addition',
            },
            {
                questionCount: 2,
                expectedDifficulty: 2,
                functionToCall: 'addition',
            },
            {
                questionCount: 1,
                expectedDifficulty: 2,
                functionToCall: 'addition',
            },
        ].forEach(({ expectedDifficulty, questionCount, functionToCall }) => {
            test(`calls ${functionToCall} with difficulty ${expectedDifficulty} with questionCount ${questionCount}`, () => {
                const testGuardian = new MultipGuardian();
                testGuardian.questionCount = questionCount;

                testGuardian.mathQuestion();

                expect(guardianUtils[functionToCall]).toHaveBeenCalled();
                expect(guardianUtils[functionToCall]).toHaveBeenCalledWith(expectedDifficulty);
                expect(testGuardian.question).toEqual('Q')
                expect(testGuardian.answer).toEqual('A')
            });
        });
    });
    test('nextQuestionPrep() decrements the questionCount by 1', () => {
        const testGuardian = new MultipGuardian();
        testGuardian.questionCount = 5;

        testGuardian.nextQuestionPrep();

        expect(testGuardian.questionCount).toEqual(4);
    });
});

describe('Divid Guardian', () => {
    describe('mathQuestion()', () => {
        [
            {
                questionCount: 5,
                expectedDifficulty: 0,
                functionToCall: 'subtraction',
            },
            {
                questionCount: 4,
                expectedDifficulty: 0,
                functionToCall: 'subtraction',
            },
            {
                questionCount: 3,
                expectedDifficulty: 1,
                functionToCall: 'subtraction',
            },
            {
                questionCount: 2,
                expectedDifficulty: 2,
                functionToCall: 'subtraction',
            },
            {
                questionCount: 1,
                expectedDifficulty: 2,
                functionToCall: 'subtraction',
            },
        ].forEach(({ expectedDifficulty, questionCount, functionToCall }) => {
            test(`calls ${functionToCall} with difficulty ${expectedDifficulty} with questionCount ${questionCount}`, () => {
                const testGuardian = new DividGuardian();
                testGuardian.questionCount = questionCount;

                testGuardian.mathQuestion();

                expect(guardianUtils[functionToCall]).toHaveBeenCalled();
                expect(guardianUtils[functionToCall]).toHaveBeenCalledWith(expectedDifficulty);
                expect(testGuardian.question).toEqual('Q')
                expect(testGuardian.answer).toEqual('A')
            });
        });
    });
    test('nextQuestionPrep() decrements the questionCount by 1', () => {
        const testGuardian = new DividGuardian();
        testGuardian.questionCount = 5;

        testGuardian.nextQuestionPrep();

        expect(testGuardian.questionCount).toEqual(4);
    });
});

describe('Square Guardian', () => {
    describe('mathQuestion()', () => {
        [
            {
                questionCount: 5,
                expectedDifficulty: 0,
                functionToCall: 'addition',
            },
            {
                questionCount: 4,
                expectedDifficulty: 1,
                functionToCall: 'addition',
            },
            {
                questionCount: 3,
                expectedDifficulty: 2,
                functionToCall: 'addition',
            },
            {
                questionCount: 2,
                expectedDifficulty: 0,
                functionToCall: 'multiplication',
            },
            {
                questionCount: 1,
                expectedDifficulty: 1,
                functionToCall: 'multiplication',
            },
        ].forEach(({ expectedDifficulty, questionCount, functionToCall }) => {
            test(`calls ${functionToCall} with difficulty ${expectedDifficulty} with questionCount ${questionCount}`, () => {
                const testGuardian = new SquareGuardian();
                testGuardian.questionCount = questionCount;

                testGuardian.mathQuestion();

                expect(guardianUtils[functionToCall]).toHaveBeenCalled();
                expect(guardianUtils[functionToCall]).toHaveBeenCalledWith(expectedDifficulty);
                expect(testGuardian.question).toEqual('Q')
                expect(testGuardian.answer).toEqual('A')
            });
        });
    });
    describe('nextQuestionPrep()', () => {
        test('decrements the questionCount by 1', () => {
            const testGuardian = new SquareGuardian();
            testGuardian.questionCount = 5;
    
            testGuardian.nextQuestionPrep();
    
            expect(testGuardian.questionCount).toEqual(4);
        });

        test('Sets the requiredItem to Multip if the questionCount is 2 after decrementing', () => {
            const testGuardian = new SquareGuardian();
            const expectedQuestionCount = 2
            testGuardian.questionCount = expectedQuestionCount + 1;
    
            testGuardian.nextQuestionPrep();
    
            expect(testGuardian.questionCount).toEqual(expectedQuestionCount);
            expect(testGuardian.requiredItem).toMatch(/Multip/i);
        });
    })
});

describe('Radical Guardian', () => {
    describe('mathQuestion()', () => {
        [
            {
                questionCount: 5,
                expectedDifficulty: 1,
                functionToCall: 'addition',
            },
            {
                questionCount: 4,
                expectedDifficulty: 2,
                functionToCall: 'subtraction',
            },
            {
                questionCount: 3,
                expectedDifficulty: 2,
                functionToCall: 'square',
            },
            {
                questionCount: 2,
                expectedDifficulty: 1,
                functionToCall: 'division',
            },
            {
                questionCount: 1,
                expectedDifficulty: 2,
                functionToCall: 'division',
            },
        ].forEach(({ expectedDifficulty, questionCount, functionToCall }) => {
            test(`calls ${functionToCall} with difficulty ${expectedDifficulty} with questionCount ${questionCount}`, () => {
                const testGuardian = new RadicalGuardian();
                testGuardian.questionCount = questionCount;

                testGuardian.mathQuestion();

                expect(guardianUtils[functionToCall]).toHaveBeenCalled();
                expect(guardianUtils[functionToCall]).toHaveBeenCalledWith(expectedDifficulty);
                expect(testGuardian.question).toEqual('Q')
                expect(testGuardian.answer).toEqual('A')
            });
        });
    });
    describe('nextQuestionPrep()', () => {
        test('decrements the questionCount by 1', () => {
            const testGuardian = new RadicalGuardian();
            testGuardian.questionCount = 5;
    
            testGuardian.nextQuestionPrep();
    
            expect(testGuardian.questionCount).toEqual(4);
        });

        test('Sets the requiredItem to Square if the questionCount is 3 after decrementing', () => {
            const testGuardian = new RadicalGuardian();
            const expectedQuestionCount = 3
            testGuardian.questionCount = expectedQuestionCount + 1;
    
            testGuardian.nextQuestionPrep();
    
            expect(testGuardian.questionCount).toEqual(expectedQuestionCount);
            expect(testGuardian.requiredItem).toMatch(/square/i);
        });
        test('Sets the requiredItem to Divid if the questionCount is 2 after decrementing', () => {
            const testGuardian = new RadicalGuardian();
            const expectedQuestionCount = 2
            testGuardian.questionCount = expectedQuestionCount + 1;
    
            testGuardian.nextQuestionPrep();
    
            expect(testGuardian.questionCount).toEqual(expectedQuestionCount);
            expect(testGuardian.requiredItem).toMatch(/divid/i);
        });
    })
});

describe('Artifact Guardian', () => {
    describe('mathQuestion()', () => {
        [
            {
                questionCount: 10,
                expectedDifficulty: 2,
                functionToCall: 'subtraction',
            },
            {
                questionCount: 8,
                expectedDifficulty: 2,
                functionToCall: 'multiplication',
            },
            {
                questionCount: 7,
                expectedDifficulty: 1,
                functionToCall: 'square',
            },
            {
                questionCount: 6,
                expectedDifficulty: 2,
                functionToCall: 'square',
            },
            {
                questionCount: 4,
                expectedDifficulty: 2,
                functionToCall: 'division',
            },
            {
                questionCount: 3,
                expectedDifficulty: 1,
                functionToCall: 'root',
            },
            {
                questionCount: 2,
                expectedDifficulty: 2,
                functionToCall: 'root',
            },
            {
                questionCount: 1,
                expectedDifficulty: 2,
                functionToCall: 'addition',
            },
        ].forEach(({ expectedDifficulty, questionCount, functionToCall }) => {
            test(`calls ${functionToCall} with difficulty ${expectedDifficulty} with questionCount ${questionCount}`, () => {
                const testGuardian = new ArtifactGuardian();
                testGuardian.questionCount = questionCount;

                testGuardian.mathQuestion();

                expect(guardianUtils[functionToCall]).toHaveBeenCalled();
                expect(guardianUtils[functionToCall]).toHaveBeenCalledWith(expectedDifficulty);
                expect(testGuardian.question).toEqual('Q')
                expect(testGuardian.answer).toEqual('A')
            });
        });
    });
    describe('nextQuestionPrep()', () => {
        test('decrements the questionCount by 1', () => {
            const testGuardian = new ArtifactGuardian();
            testGuardian.questionCount = 5;
    
            testGuardian.nextQuestionPrep();
    
            expect(testGuardian.questionCount).toEqual(4);
        });

        [
            {
                requiredItem: 'Multip',
                expectedQuestionCount: 10,
            },
            {
                requiredItem: 'Square',
                expectedQuestionCount: 8,
            },
            {
                requiredItem: 'Divid',
                expectedQuestionCount: 6,
            },
            {
                requiredItem: 'Radical',
                expectedQuestionCount: 4,
            },
            {
                requiredItem: 'Calculator',
                expectedQuestionCount: 2,
            },
        ].forEach(({requiredItem, expectedQuestionCount}) => {
            test(`Sets the requiredItem to ${requiredItem} if the questionCount is ${expectedQuestionCount} after decrementing`, () => {
                const testGuardian = new ArtifactGuardian();
                testGuardian.questionCount = expectedQuestionCount + 1;
        
                testGuardian.nextQuestionPrep();
        
                expect(testGuardian.questionCount).toEqual(expectedQuestionCount);
                expect(testGuardian.requiredItem).toMatch(new RegExp(requiredItem));
            });
        })
    })
});
