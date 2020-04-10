from abc import ABC, abstractmethod
from classes.player import Player
from utils.colors import color
from assets.guardian_poses import multip_guardian
from random import randint


class Guardian(Player, ABC):

    def __init__(self, name, inv=None):
        super().__init__(name, inv=inv)
        self.shrine = None
        self.try_count = 3
        self.question_count = 5
        self.question = None
        self.answer = None
        self.required_item = None

    @abstractmethod
    def create_question(self):
        pass

    @abstractmethod
    def next_question_prep(self):
        pass

    def item_request(self):
        """
        Creates a question to request for self.item.
        Sets self.question to the newly created question.
        """
        self.question = color(
            f"{self.name} is requesting you use ~c({self.required_item})")

    def check_victory(self):
        if self.try_count == 0:
            return self.guardian_win()
        elif self.question_count == 0:
            return self.guardian_death()
        else:
            return None

    def guardian_win(self):
        self.try_count = 3
        self.question_count = 5
        self.question = None
        self.answer = None
        self.required_item = None
        return False

    def guardian_death(self):
        self.shrine.add_item(self.__inv[0])
        self.shrine.guardian = None
        return True

    def ask_question(self):
        """
        Asks a question if there is one,
        Or creates a question to ask.
        Returns the string self.question 
        """
        if self.question is None:
            # If there's no question, create one
            if self.required_item is not None:
                # Required item? Create a question for it
                self.item_request()
            else:
                # Otherwise, call create_question()
                self.create_question()
        return self.question

    def check_item(self, item):
        """
        Checks if the used item matches what is required.
        If so, resets the item and question, returning true.
        Else, returns false.
        """
        if item.name == self.required_item:
            self.required_item = None
            self.question = None
            return True
        else:
            self.try_count -= 1
            return False

    def check_answer(self, answer):
        """
        Checks if the answer matches self.answer.
        If so, resets the answer and question, returning true,
            and calls next_question_prep().
        Else, returns false.
        """
        if answer == str(self.answer):
            self.answer = None
            self.question = None
            self.next_question_prep()
            return True
        else:
            self.try_count -= 1
            return False


class MultipGuardian(Guardian):

    def __init__(self, name, inv=None):
        super().__init__(name, inv)
        self.poses = multip_guardian()

    def addition(self, difficulty=0):
        """
        Creates an addition question,
        Sets self.question to the newly created question,
        and sets self.answer to the expected value
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
        self.answer = str(num1 + num2)
        self.question = color(f"What is ~W{num1}~e plus ~W{num2}~e?")

    def create_question(self):
        """MultipGuardian only calls self.addition()"""
        if self.question_count < 4:
            self.addition(1)
        elif self.question_count < 2:
            self.addition(2)
        else:
            self.addition()

    def next_question_prep(self):
        self.question_count -= 1
