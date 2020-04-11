from abc import ABCMeta, abstractmethod
from classes.player import Player
from utils.colors import color
from assets.guardian_poses import multip_guardian, divid_guardian
from random import randint, choice


class CanAdd:
    """Mixin to allow addition"""

    def addition(self, difficulty=0):
        """
        Creates an addition question.

        returns an array → [question, answer]
        """
        num1 = 0
        num2 = 0
        if difficulty == 0:
            num1 = randint(0, 20)
            num2 = randint(0, 20)
        elif difficulty == 1:
            num1 = randint(9, 50)
            num2 = randint(9, 50)
        else:
            num1 = randint(15, 100)
            num2 = randint(15, 100)
        answer = str(num1 + num2)
        question = color(f"What is ~W{num1}~e plus ~W{num2}~e?")
        return [question, answer]


class CanSubtract:
    """Mixin to allow subtraction"""

    def subtraction(self, difficulty=0):
        """
        Creates a subtraction question.

        returns an array → [question, answer]
        """
        num1 = 0
        num2 = 0
        while True:
            if difficulty == 0:
                num1 = randint(0, 20)
                num2 = randint(0, 20)
            elif difficulty == 1:
                num1 = randint(9, 50)
                num2 = randint(9, 50)
            else:
                num1 = randint(15, 100)
                num2 = randint(15, 100)

            if not num1 - num2 < 0:
                break
        answer = str(num1 - num2)
        question = color(f"What is ~W{num1}~e minus ~W{num2}~e?")
        return [question, answer]


class CanDivide:
    """Mixin to allow divison"""

    def division(self, difficulty=0):
        """
        Creates a division question.

        returns an array → [question, answer]
        """
        num1 = 0
        num2 = 0
        while True:
            if difficulty == 0:
                num1 = randint(2, 20)
                num2 = randint(2, int(num1/2))
            elif difficulty == 1:
                num1 = randint(15, 50)
                num2 = randint(2, int(num1/2))
            else:
                num1 = randint(20, 100)
                num2 = randint(2, int(num1/2))

            if num1 % num2 == 0:
                break
        answer = str(num1 / num2)
        question = color(f"What is ~W{num1}~e divided by ~W{num2}~e?")
        return [question, answer]


class CanMultiply:
    """Mixin to allow multiplication"""

    def multiplication(self, difficulty=0):
        """
        Creates a multiplication question.

        returns an array → [question, answer]
        """
        num1 = 0
        num2 = 0
        if difficulty == 0:
            num1 = randint(0, 5)
            num2 = randint(0, 5)
        elif difficulty == 1:
            num1 = randint(0, 10)
            num2 = randint(0, 10)
        else:
            num1 = randint(4, 20)
            num2 = randint(4, 20)
        answer = str(num1 * num2)
        question = color(f"What is ~W{num1}~e times ~W{num2}~e?")
        return [question, answer]


class CanSquare:
    """Mixin to allow exponential multiplication"""

    def square(self, difficulty=0):
        """
        Creates an exponent question.

        returns an array → [question, answer]
        """
        num1 = 0
        num2 = 0
        if difficulty == 0:
            num1 = randint(2, 5)
            num2 = 2
        elif difficulty == 1:
            num1 = randint(2, 10)
            num2 = 2
        else:
            num1 = randint(2, 13)
            num2 = randint(2, 3)

        if num2 == 2:
            second_half = "~Wsquared~e"
        else:
            second_half = "~Wcubed~e"
        question = color(f"What is ~W{num1}~e {second_half}?")
        answer = str(num1 ** num2)
        return [question, answer]


class CanRoot:
    """Mixin to allow radical division"""

    def root(self, difficulty=0):
        """
        Creates a radical division question.

        returns an array → [question, answer]
        """
        squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225]
        cubes = [8, 27, 64, 125, 216, 343]

        num = 0
        is_square = True

        if difficulty == 0:
            num = choice(squares[:10])
            is_square = True
        elif difficulty == 1:
            num = choice(squares[5:])
            is_square = True
        else:
            num = choice(cubes)
            is_square = False

        if is_square:
            root = "~Wsquare~e"
            answer = str(int(num1 ** (1/2)))
        else:
            root = "~Wcube~e"
            answer = str(int(num1 ** (1/3)))
        question = color(f"What is the {root} root of ~W{num1}~e?")
        return [question, answer]


class Guardian(Player):
    """Parent Guardian Class. All Guardians derive from this class."""

    def __init__(self, name, inv=None):
        super().__init__(name, inv=inv)
        self.shrine = None
        self.battle = None

    def start_quiz(self):
        self.battle.required_item = "calculator"

    def create_question(self):
        """Creates a new question to ask the player"""
        raise NotImplementedError

    def next_question_prep(self):
        """
        Preps for the next question.

        This includes decreasing the question_count,
        and setting a required_item if necessary.
        """
        raise NotImplementedError

    def win(self):
        pass

    def lose(self):
        self.shrine.add_item(self.__inv[0])
        self.shrine.guardian = None


class MultipGuardian(CanAdd, Guardian):
    """Asks addition questions. Drops the Multip sign."""

    def __init__(self, name, inv=None):
        super().__init__(name, inv)
        self.poses = multip_guardian()

    def addition(self, difficulty=0):
        """
        Creates an addition question.

        Sets question to the newly created question,
        and sets answer to the expected value.
        """
        num1 = 0
        num2 = 0
        if difficulty == 0:
            num1 = randint(0, 20)
            num2 = randint(0, 20)
        elif difficulty == 1:
            num1 = randint(9, 50)
            num2 = randint(9, 50)
        else:
            num1 = randint(15, 100)
            num2 = randint(15, 100)
        self.battle.answer = str(num1 + num2)
        self.battle.question = color(f"What is ~W{num1}~e plus ~W{num2}~e?")

    def create_question(self):
        if self.battle.question_count < 4:
            self.addition(1)
        elif self.battle.question_count < 2:
            self.addition(2)
        else:
            self.addition()

    def next_question_prep(self):
        self.battle.question_count -= 1


class DividGuardian(CanSubtract, Guardian):

    def __init__(self, name, inv=None):
        super().__init__(name, inv)
        self.poses = divid_guardian()

    def
