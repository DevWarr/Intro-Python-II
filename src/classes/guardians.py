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
        self.battle.question = None

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
        super().__init__("Multip Guardian", "Guardian of the Multip Shrine", multip_guardian())

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
        super().next_question_prep()
        self.battle.question_count -= 1


class DividGuardian(CanSubtract, Guardian):

    def __init__(self):
        super().__init__("Divid Guardian", "Guardian of the Divid Shrine", divid_guardian())

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
        super().next_question_prep()
        self.battle.question_count -= 1
