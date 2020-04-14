from abc import ABCMeta, abstractmethod
from classes.mixins import *
from utils.colors import color
from assets.guardian_poses import *
from random import randint, choice


class Guardian():
    """Parent Guardian Class. All Guardians derive from this class."""

    def __init__(self, name, pose_creator):
        self.name = name
        self.shrine = None
        self.battle = None
        self.poses = pose_creator()

    def prep_quiz(self):
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
        """Resets the battle property to None."""
        self.battle = None

    def lose(self):
        """Detaches self from the shrine room."""
        self.shrine.guardian = None


class MultipGuardian(CanAdd, Guardian):
    """Asks addition questions. Drops the Multip sign."""

    def __init__(self):
        super().__init__("Multip Guardian", multip_guardian())

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
        [self.battle.answer, self.battle.question] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1


class DividGuardian(CanSubtract, Guardian):

    def __init__(self):
        super().__init__("Divid Guardian", divid_guardian())

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
        [self.battle.answer, self.battle.question] = problem

    def next_question_prep(self):
        self.battle.question_count -= 1
