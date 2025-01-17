/**
 * Returns a random number between the min and max values.
 *
 * Both min and max included.
 */
export const randint = (min: number, max: number): number => {
  return Number(min + Math.round(Math.random() * (max - min)));
};

export type MathQuestion = (difficulty: number) => [string, number];

/**
 * Creates an addition question.
 */
export const buildAdditionQuestion: MathQuestion = (difficulty) => {
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
  const answer = num1 + num2;
  const question = `What is ${num1} plus ${num2} ?`;
  return [question, answer];
};

/**
 * Creates a subtraction question.
 */
export const buildSubtractionQuestion: MathQuestion = (difficulty) => {
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

  const answer = num1 - num2;
  const question = `What is ${num1} minus ${num2} ?`;
  return [question, answer];
};

/**
 * Creates a division question.
 */
export const buildDivisionQuestion: MathQuestion = (difficulty) => {
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
  const answer = Math.round(num1 / num2);
  const question = `What is ${num1} divided by ${num2} ?`;
  return [question, answer];
};

/**
 * Creates a multiplication question.
 */
export const buildMultiplicationQuestion: MathQuestion = (difficulty) => {
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

  const answer = num1 * num2;
  const question = `What is ${num1} times ${num2} ?`;
  return [question, answer];
};

/**
 * Creates an exponent question.
 */
export const buildExponentQuestion: MathQuestion = (difficulty) => {
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
  const second_half = num2 == 2 ? "squared" : "cubed";

  const question = `What is ${num1} ${second_half} ?`;
  const answer = num1 ** num2;

  return [question, answer];
};

const SQUARES = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
const CUBES = [8, 27, 64, 125, 216, 343];

/**
 * Creates a radical division question.
 */
export const buildRootQuestion: MathQuestion = (difficulty) => {
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

  let root, answer;
  if (is_square) {
    root = "square";
    answer = Math.round(num ** (1 / 2));
  } else {
    root = "cube";
    answer = Math.round(num ** (1 / 3));
  }

  const question = `What is the ${root} root of ${num} ?`;
  return [question, answer];
};
