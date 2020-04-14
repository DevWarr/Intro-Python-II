from abc import ABCMeta, abstractmethod
from classes.mixins import *
from assets.guardian_poses import *


class Guardian():
    """Parent Guardian Class. All Guardians derive from this class."""

    def __init__(self, name, description, pose_dict):
        self.name = name
        self.description = description
        self.shrine = None
        self.battle = None
        self.poses = pose_dict

    def prep_quiz(self):
        """Sets the calculator as the initially required item."""
        self.battle.required_item = "Calculator"

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
        """Resets the battle property to None."""
        self.battle = None

    def lose(self):
        """Detaches self from the shrine room."""
        self.shrine.guardian = None

    def __str__(self):
        return f"~W{self.name}\n~e~g{self.description}~e"


class MultipGuardian(CanAdd, Guardian):
    """Asks addition questions. Drops the Multip sign."""

    def __init__(self):
        super().__init__("Multip Guardian", "Guardian of the Multip Shrine. Keep your guard!", multip_guardian())

    def create_question(self):
        if self.battle.question_count > 3:
            # First two questions? Difficulty easy
            problem = self.addition(0)
        elif self.battle.question_count > 2:
            # Third question? Difficulty medium
            problem = self.addition(1)
        else:
            # Last two questions? Difficulty hard
            problem = self.addition(2)
        [self.battle.question, self.battle.answer] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1


class DividGuardian(CanSubtract, Guardian):

    def __init__(self):
        super().__init__("Divid Guardian", "Guardian of the Divid Shrine. Keep it sleek, slick.", divid_guardian())

    def create_question(self):
        if self.battle.question_count > 3:
            # First two questions? Difficulty easy
            problem = self.subtraction(0)
        elif self.battle.question_count > 2:
            # Third question? Difficulty medium
            problem = self.subtraction(1)
        else:
            # Last two questions? Difficulty hard
            problem = self.subtraction(2)
        [self.battle.question, self.battle.answer] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1


class SquareGuardian(CanAdd, CanMultiply, Guardian):

    def __init__(self):
        super().__init__("Square Guardian", "Guardian of the Square Shrine. Stay happy, stay civil!", square_guardian())

    def create_question(self):
        """
        Creates a unique question for each question_count:
        - 5 → addition(easy)
        - 4 → addition(med)
        - 3 → addition(hard)
        - 2 → multiplication(easy)
        - 1 → multiplication(hard)
        """
        if self.battle.question_count == 5:
            problem = self.addition(0)
        elif self.battle.question_count == 4:
            problem = self.addition(1)
        elif self.battle.question_count == 3:
            problem = self.addition(2)
        elif self.battle.question_count == 2:
            problem = self.multiplication(0)
        else:
            problem = self.multiplication(1)

        [self.battle.question, self.battle.answer] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1
        if self.battle.question_count == 2:
            self.battle.required_item = "Multip"


class RadicalGuardian(CanAdd, CanSubtract, CanSquare, CanDivide, Guardian):

    def __init__(self):
        super().__init__("Radical Guardian", "Guardian of the Radical Shrine. Radical!!!", radical_guardian())

    def create_question(self):
        """
        Creates a unique question for each question_count:
        - 5 → addition(med)
        - 4 → subtraction(hard)
        - 3 → square(hard)
        - 2 → divide(med)
        - 1 → divide(hard)
        """
        if self.battle.question_count == 5:
            problem = self.addition(1)
        elif self.battle.question_count == 4:
            problem = self.subtraction(2)
        elif self.battle.question_count == 3:
            problem = self.square(2)
        elif self.battle.question_count == 2:
            problem = self.division(1)
        else:
            problem = self.division(2)

        [self.battle.question, self.battle.answer] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1
        if self.battle.question_count == 3:
            self.battle.required_item = "Square"

        if self.battle.question_count == 2:
            self.battle.required_item = "Divid"


class ArtifactGuardian(CanMultiply, CanSquare, CanDivide, CanRoot, CanAdd, CanSubtract, Guardian):

    def __init__(self):
        super().__init__("Artifact Guardian", "The final challenge! If you ~Wrun away~e~g, your questions ~Gwon't~e~g get reset.", artifact_guardian())
        # The artifact Guardian holds it's own questions and tries.
        # You can run away and the question count won't go down.
        self.question_count = 10
        self.try_count = 3
    
    def prep_quiz(self):
        """
        Sets the battle's try count and question count
        to the Guardian's saved values.

        This allows the player to run away and come back
        without resetting their questions. 
        """
        self.battle.try_count = self.try_count
        self.battle.question_count = self.question_count + 1
        # We set question_count + 1 because next_question_prep
        # will decrease it by one automatically
        self.next_question_prep()

    def create_question(self):
        """
        Creates a unique question for each question_count:
        - 10 → multiplication(hard)
        - 9  → multiplication(hard)
        - 8  → square(med)
        - 7  → square(hard)
        - 6  → division(hard)
        - 5  → division(hard)
        - 4  → root(med)
        - 3  → root(hard)
        - 2  → addition(hard)
        - 1  → subtraction(hard)
        """
        if self.battle.question_count > 8:
            problem = self.multiplication(2)

        elif self.battle.question_count > 7:
            problem = self.square(1)
        elif self.battle.question_count > 6:
            problem = self.square(2)

        elif self.battle.question_count > 4:
            problem = self.division(2)

        elif self.battle.question_count > 3:
            problem = self.root(1)
        elif self.battle.question_count > 2:
            problem = self.root(2)

        elif self.battle.question_count > 1:
            problem = self.addition(2)
        else:
            problem = self.subtraction(2)

        [self.battle.question, self.battle.answer] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1
        if self.battle.question_count == 10:
            self.battle.required_item = "Multip"

        if self.battle.question_count == 8:
            self.battle.required_item = "Square"

        if self.battle.question_count == 6:
            self.battle.required_item = "Divid"

        if self.battle.question_count == 4:
            self.battle.required_item = "Radical"

        if self.battle.question_count == 2:
            self.battle.required_item = "Calculator"

    def win(self):
        self.question_count = self.battle.question_count
        super().win()
