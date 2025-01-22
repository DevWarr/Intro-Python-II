import { GuardianQuestion } from "./Guardians";

/**
 * Returns a random number between the min and max values.
 *
 * Both min and max included.
 */
export const randint = (min: number, max: number): number => {
  return Number(min + Math.round(Math.random() * (max - min)));
};

/**
 * Creates an addition question.
 */
export const buildAdditionQuestion = (difficulty: number): GuardianQuestion => {
  let num1, num2;
  if (difficulty == 0) {
    num1 = randint(0, 20);
    num2 = randint(0, 20);
  } else if (difficulty == 1) {
    num1 = randint(9, 50);
    num2 = randint(9, 50);
  } else {
    num1 = randint(15, 100);
    num2 = randint(15, 100);
  }

  return {
    mathAnswer: num1 + num2,
    mathQuestion: `What is ${num1} plus ${num2} ?`,
  };
};

/**
 * Creates a subtraction question.
 */
export const buildSubtractionQuestion = (difficulty: number): GuardianQuestion => {
  let num1, num2;
  while (true) {
    if (difficulty == 0) {
      num1 = randint(0, 20);
      num2 = randint(0, 20);
    } else if (difficulty == 1) {
      num1 = randint(9, 50);
      num2 = randint(9, 50);
    } else {
      num1 = randint(15, 100);
      num2 = randint(15, 100);
    }

    if (num1 - num2 >= 0) break;
  }
  return {
    mathAnswer: num1 - num2,
    mathQuestion: `What is ${num1} minus ${num2} ?`,
  };
};

/**
 * Creates a division question.
 */
export const buildDivisionQuestion = (difficulty: number): GuardianQuestion => {
  let num1, num2;
  while (true) {
    if (difficulty == 0) {
      num1 = randint(6, 20);
      num2 = randint(2, Math.round(num1 / 2));
    } else if (difficulty == 1) {
      num1 = randint(15, 50);
      num2 = randint(2, Math.round(num1 / 2));
    } else {
      num1 = randint(20, 100);
      num2 = randint(2, Math.round(num1 / 2));
    }

    if (num1 % num2 === 0) break;
  }
  return {
    mathAnswer: Math.round(num1 / num2),
    mathQuestion: `What is ${num1} divided by ${num2} ?`,
  };
};

/**
 * Creates a multiplication question.
 */
export const buildMultiplicationQuestion = (difficulty: number): GuardianQuestion => {
  let num1, num2;
  if (difficulty == 0) {
    num1 = randint(3, 9);
    num2 = randint(3, 9);
  } else if (difficulty == 1) {
    num1 = randint(3, 14);
    num2 = randint(3, 14);
  } else {
    num1 = randint(4, 20);
    num2 = randint(4, 20);
  }

  return {
    mathAnswer: num1 * num2,
    mathQuestion: `What is ${num1} times ${num2} ?`,
  };
};

/**
 * Creates an exponent question.
 */
export const buildExponentQuestion = (difficulty: number): GuardianQuestion => {
  let num1, num2;
  if (difficulty == 0) {
    num1 = randint(2, 5);
    num2 = 2;
  } else if (difficulty == 1) {
    num1 = randint(2, 10);
    num2 = 2;
  } else {
    num1 = randint(2, 13);
    num2 = randint(2, 3);
  }
  return {
    mathQuestion: `What is ${num1} ${num2 == 2 ? "squared" : "cubed"} ?`,
    mathAnswer: num1 ** num2,
  };
};

const SQUARES = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
const CUBES = [8, 27, 64, 125, 216, 343];

/**
 * Creates a radical division question.
 */
export const buildRootQuestion = (difficulty: number): GuardianQuestion => {
  let num, is_square;

  if (difficulty == 0) {
    // pick any random square from the first ten options
    num = SQUARES[Math.round(Math.random() * 10)];
    is_square = true;
  } else if (difficulty == 1) {
    // pick any random square from the 7th option onward
    num = SQUARES[6 + Math.round(Math.random() * (SQUARES.length - 7))];
    is_square = true;
  } else {
    // pick any random cube
    num = CUBES[Math.round(Math.random() * (CUBES.length - 1))];
    is_square = false;
  }

  let root, mathAnswer;
  if (is_square) {
    root = "square";
    mathAnswer = Math.round(num ** (1 / 2));
  } else {
    root = "cube";
    mathAnswer = Math.round(num ** (1 / 3));
  }

  return {
    mathAnswer,
    mathQuestion: `What is the ${root} root of ${num} ?`,
  };
};
