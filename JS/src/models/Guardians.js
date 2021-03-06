const { addition, subtraction, division, multiplication, square, root } = require('./guardianUtils');

const STAND = 'stand';
const CORRECT = 'correct';
const INCORRECT = 'incorrect';

class NotImplementedError extends Error {
	constructor(methodName) {
		super();
		this.message =
			`This method (${methodName}) has not been implemented. Create a child class that extends this class, and implement this function.`;
	}
}

/**Parent Guardian Class. All Guardians derive from this class. */
class Guardian {

	/**
	 * 
	 * @param {string} name 
	 * @param {string} description 
	 */
	constructor(name, description) {
		this.name = name;
		this.description = description;
		this.shrine = {};
		this.pose = STAND;

		this.tryCount = 3;
		this.questionCount = 5;
		this.question = null;
		this.answer = null;
		this.requiredItem = 'Calculator';
	}

	/**
	 * Preps for the battle
	 *
	 * If the player runs away and returns,
	 * this will make sure to reset the tries, questions, and required item.
	 */
	prepQuiz = () => {
		this.tryCount = 3;
		this.questionCount = 5;
		this.question = null;
		this.requiredItem = 'Calculator';
	}
	/**
	 * Resets the guardian pose, and creates a new question.
	 *
	 * If there is already a question, does nothing.
	 * If there is a required item, asks for item.
	 * All else, creates and asks a new math question.
	 */
	createQuestion = () => {
		this.pose = STAND;
		if (this.question) return;

		if (this.requiredItem) {
			this.question = `${this.name} is requesting you use (${this.requiredItem})`;
		} else {
			this.mathQuestion();
		}
	}

	mathQuestion = () => {
		throw new NotImplementedError('mathQuestion');
	}

	/**
	 * Preps for the next question.
	 *
	 * This includes decreasing the questionCount,
	 * and setting a requiredItem if necessary.
	 */
	nextQuestionPrep = () => {
		throw new NotImplementedError('nextQuestionPrep');
	}

	/**
	 * Checks if the used item matches what is required.
	 *
	 * If:
	 * - Item matches required item   → true
	 * - Item does not match required → false
	 * 
	 * @param {string} name - name of the item 
	 * 
	 * @returns boolean
	 */
	checkItem(name) {
		if (name === this.requiredItem) {
			this.requiredItem = null;
			this.question = null;
			this.pose = CORRECT;
			return true;
		} else {
			this.pose = INCORRECT;
			this.tryCount -= 1;
			return false;
		}
	}

	/**
	 * Checks if the answer matches self.answer.
	 *
	 * If the answer is correct,
	 * resets the answer,
	 * calls nextQuestionPrep(),
	 * and returns true,
	 *
	 * Else, returns false.
	 * 
	 * @param {number} answer - the given answer to the math problem.
	 * 
	 * @returns boolean
	 */
	checkAnswer(answer) {
		if (answer === this.answer) {
			this.answer = null;
			this.question = null;
			this.pose = CORRECT;
			this.nextQuestionPrep();
			return true;
		} else {
			this.pose = INCORRECT;
			this.tryCount -= 1;
			return false;
		}
	}

	/**
	 * Checks if the player has won/lost the battle.
	 *
	 * If the player loses:
	 * return false
	 *
	 * If the player wins:
	 * detach the guardian from the Shrine and return true
	 *
	 * Still battling? Return null
	 * 
	 * @returns boolean | null
	 */
	checkVictory = () => {
		if (this.tryCount === 0) return false;
		else if (this.questionCount === 0) {
			this.shrine.guardian = null;
			return true;
		} else return null;
	}
}

/**Asks addition questions. Drops the Multip sign.*/
class MultipGuardian extends Guardian {
	constructor() {
		super('Multip Guardian', 'Guardian of the Multip Shrine. Keep your guard!');
	}

	/**
	 * Creates a unique question for each questionCount:
	 * - 5 → addition(easy)
	 * - 4 → addition(easy)
	 * - 3 → addition(med)
	 * - 2 → addition(hard)
	 * - 1 → addition(hard)
	 */
	mathQuestion = () => {
		let problem;
		if (this.questionCount > 3) {
			// First two questions? Difficulty easy
			problem = addition(0);
		} else if (this.questionCount > 2) {
			// Third question? Difficulty medium
			problem = addition(1);
		} else {
			// Last two questions? Difficulty hard
			problem = addition(2);
		}
		[this.question, this.answer] = problem;
	}

	nextQuestionPrep = () => {
		this.questionCount -= 1;
	}
}

class DividGuardian extends Guardian {
	constructor() {
		super('Divid Guardian', 'Guardian of the Divid Shrine. Keep it sleek, slick.');
	}

	/**
	 * Creates a unique question for each questionCount:
	 * - 5 → subtraction(easy)
	 * - 4 → subtraction(easy)
	 * - 3 → subtraction(med)
	 * - 2 → subtraction(hard)
	 * - 1 → subtraction(hard)
	 */
	mathQuestion = () => {
		let problem;
		if (this.questionCount > 3) {
			// First two questions? Difficulty easy
			problem = subtraction(0);
		} else if (this.questionCount > 2) {
			// Third question? Difficulty medium
			problem = subtraction(1);
		} else {
			// Last two questions? Difficulty hard
			problem = subtraction(2);
		}
		[this.question, this.answer] = problem;
	}

	nextQuestionPrep = () => {
		this.questionCount -= 1;
	}
}

class SquareGuardian extends Guardian {
	constructor() {
		super('Square Guardian', 'Guardian of the Square Shrine. Stay happy, stay civil!');
	}

	/**
	 * Creates a unique question for each questionCount:
	 * - 5 → addition(easy)
	 * - 4 → addition(med)
	 * - 3 → addition(hard)
	 * - 2 → multiplication(easy)
	 * - 1 → multiplication(hard)
	 */
	mathQuestion = () => {
		let problem;
		switch (this.questionCount) {
			case 5:
				problem = addition(0);
				break;
			case 4:
				problem = addition(1);
				break;
			case 3:
				problem = addition(2);
				break;
			case 2:
				problem = multiplication(0);
				break;
			default:
				problem = multiplication(1);
		}

		[this.question, this.answer] = problem;
	}

	nextQuestionPrep = () => {
		this.questionCount -= 1;
		if (this.questionCount == 2) {
			this.requiredItem = 'Multip';
		}
	}
}

class RadicalGuardian extends Guardian {
	constructor() {
		super('Radical Guardian', 'Guardian of the Radical Shrine. Radical!!!');
	}

	/**
	 * Creates a unique question for each questionCount:
	 * - 5 → addition(med)
	 * - 4 → subtraction(hard)
	 * - 3 → square(hard)
	 * - 2 → divide(med)
	 * - 1 → divide(hard)
	 */
	mathQuestion = () => {
		let problem;
		switch (this.questionCount) {
			case 5:
				problem = addition(1);
				break;
			case 4:
				problem = subtraction(2);
				break;
			case 3:
				problem = square(2);
				break;
			case 2:
				problem = division(1);
				break;
			default:
				problem = division(2);
		}

		[this.question, this.answer] = problem;
	}

	nextQuestionPrep = () => {
		this.questionCount -= 1;
		if (this.questionCount == 3) {
			this.requiredItem = 'Square';
		}
		if (this.questionCount == 2) {
			this.requiredItem = 'Divid';
		}
	}
}

class ArtifactGuardian extends Guardian {
	constructor() {
		super('Artifact Guardian', "The final challenge! If you run away, your questions won't get reset.");
		// The artifact Guardian holds it's own questions and tries.
		// You can run away and the question count won't go down.
		this.questionCount = 10;
		this.tryCount = 3;
		this.requiredItem = 'Multip';
	}

	/**
	 * Sets the battle's try count and question count
	 * to the Guardian's saved values.
	 *
	 * This allows the player to run away and come back
	 * without resetting their questions.
	 */
	prepQuiz = () => {
		this.question = null;
		this.tryCount = 3;
		this.questionCount += 1;
		// We set questionCount + 1 because nextQuestionPrep
		// will decrease it by one automatically
		this.nextQuestionPrep();
	}

	/**
	 * Creates a unique question for each questionCount:
	 * - 10 → multiplication(hard)
	 * - 9  → multiplication(hard)
	 * - 8  → square(med)
	 * - 7  → square(hard)
	 * - 6  → division(hard)
	 * - 5  → division(hard)
	 * - 4  → root(med)
	 * - 3  → root(hard)
	 * - 2  → addition(hard)
	 * - 1  → subtraction(hard)
	 */
	mathQuestion = () => {
		let problem;
		switch (this.questionCount) {
			case 8:
				problem = multiplication(2);
				break;
			case 7:
				problem = square(1);
				break;
			case 6:
				problem = square(2);
				break;
			case 4:
				problem = division(2);
				break;
			case 3:
				problem = root(1);
				break;
			case 2:
				problem = root(2);
				break;
			case 1:
				problem = addition(2);
				break;
			default:
				problem = subtraction(2);
		}
		[this.question, this.answer] = problem;
	}

	nextQuestionPrep = () => {
		this.questionCount -= 1;
		switch (this.questionCount) {
			case 10:
				this.requiredItem = 'Multip';
				break;
			case 8:
				this.requiredItem = 'Square';
				break;
			case 6:
				this.requiredItem = 'Divid';
				break;
			case 4:
				this.requiredItem = 'Radical';
				break;
			case 2:
				this.requiredItem = 'Calculator';
				break;
			default:
				this.requiredItem = null;
		}
	}
}

module.exports = {
    Guardian,
    MultipGuardian,
    DividGuardian,
    SquareGuardian,
    RadicalGuardian,
    ArtifactGuardian,
	testing: { STAND, CORRECT, INCORRECT, NotImplementedError }
}