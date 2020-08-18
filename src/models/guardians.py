from abc import ABCMeta, abstractmethod
from enum import Enum
from .mixins import *


class GuardianPose(Enum):
  STAND     = "stand"
  CORRECT   = "correct"
  INCORRECT = "incorrect"


class Guardian():
  """Parent Guardian Class. All Guardians derive from this class."""

  def __init__(self, name, description):
    self.name           = name
    self.description    = description
    self.shrine         = None
    self.pose           = GuardianPose.STAND

    self.try_count      = 3
    self.question_count = 5
    self.question       = None
    self.answer         = None
    self.required_item  = "Calculator"

  def prep_quiz(self, player):
    """
    Preps for the battle.

    If the player runs away and returns,
    this will make sure to reset the tries, questions, and required item.
    """
    self.player = player
    self.try_count = 3
    self.question_count = 5
    self.question = None
    self.required_item  = "Calculator"

  def create_question(self):
    """
    Resets the guardian pose, and creates a new question.

    If there is already a question, does nothing.
    If there is a required item, asks for item.
    All else, creates and asks a new math question.
    """
    self.pose = GuardianPose.STAND
    if self.question is not None:
      return

    if self.required_item is not None:
      self.question = f"{self.name} is requesting you use ({self.required_item})"
    else:
      self.math_question()

  def math_question(self):
    raise NotImplementedError

  def next_question_prep(self):
    """
    Preps for the next question.

    This includes decreasing the question_count,
    and setting a required_item if necessary.
    """
    raise NotImplementedError

  def check_item(self, name):
    """
    Checks if the used item matches what is required.

    If:
    - Item matches required item   → True
    - Item does not match required → False
    """
    if name == self.required_item:
      self.required_item = None
      self.question = None
      self.pose = GuardianPose.CORRECT
      return True
    else:
      self.pose = GuardianPose.INCORRECT
      self.try_count -= 1
      return False

  def check_answer(self, answer):
    """
    Checks if the answer matches self.answer.

    If the answer is correct,
    resets the answer,
    calls next_question_prep(),
    and returns true,

    Else, returns false.
    """
    if answer == self.answer:
      self.answer = None
      self.question = None
      self.pose = GuardianPose.CORRECT
      self.next_question_prep()
      return True
    else:
      self.pose = GuardianPose.INCORRECT
      self.try_count -= 1
      return False

  def check_victory(self):
    """
    Checks if the player has won/lost the battle.

    If the player loses:
    return False

    If the player wins:
    detach the guardian from the Shrine and return True

    Still battling? Return None
    """
    if self.try_count == 0:
      return False
    elif self.question_count == 0:
      self.shrine.guardian = None
      return True
    else:
      return None


class MultipGuardian(CanAdd, Guardian):
  """Asks addition questions. Drops the Multip sign."""

  def __init__(self):
    super().__init__("Multip Guardian",
                     "Guardian of the Multip Shrine. Keep your guard!")

  def math_question(self):
    """
    Creates a unique question for each question_count:
    - 5 → addition(easy)
    - 4 → addition(easy)
    - 3 → addition(med)
    - 2 → addition(hard)
    - 1 → addition(hard)
    """
    if self.question_count > 3:
      # First two questions? Difficulty easy
      problem = self.addition(0)
    elif self.question_count > 2:
      # Third question? Difficulty medium
      problem = self.addition(1)
    else:
      # Last two questions? Difficulty hard
      problem = self.addition(2)
    [self.question, self.answer] = problem

  def next_question_prep(self):
    self.question_count -= 1


class DividGuardian(CanSubtract, Guardian):

  def __init__(self):
    super().__init__("Divid Guardian",
                     "Guardian of the Divid Shrine. Keep it sleek, slick.")

  def math_question(self):
    """
    Creates a unique question for each question_count:
    - 5 → subtraction(easy)
    - 4 → subtraction(easy)
    - 3 → subtraction(med)
    - 2 → subtraction(hard)
    - 1 → subtraction(hard)
    """
    if self.question_count > 3:
      # First two questions? Difficulty easy
      problem = self.subtraction(0)
    elif self.question_count > 2:
      # Third question? Difficulty medium
      problem = self.subtraction(1)
    else:
      # Last two questions? Difficulty hard
      problem = self.subtraction(2)
    [self.question, self.answer] = problem

  def next_question_prep(self):
    self.question_count -= 1


class SquareGuardian(CanAdd, CanMultiply, Guardian):

  def __init__(self):
    super().__init__("Square Guardian",
                     "Guardian of the Square Shrine. Stay happy, stay civil!")

  def math_question(self):
    """
    Creates a unique question for each question_count:
    - 5 → addition(easy)
    - 4 → addition(med)
    - 3 → addition(hard)
    - 2 → multiplication(easy)
    - 1 → multiplication(hard)
    """
    if self.question_count == 5:
      problem = self.addition(0)
    elif self.question_count == 4:
      problem = self.addition(1)
    elif self.question_count == 3:
      problem = self.addition(2)
    elif self.question_count == 2:
      problem = self.multiplication(0)
    else:
      problem = self.multiplication(1)

    [self.question, self.answer] = problem

  def next_question_prep(self):
    self.question_count -= 1
    if self.question_count == 2:
      self.required_item = "Multip"


class RadicalGuardian(CanAdd, CanSubtract, CanSquare, CanDivide, Guardian):

  def __init__(self):
    super().__init__("Radical Guardian",
                     "Guardian of the Radical Shrine. Radical!!!")

  def math_question(self):
    """
    Creates a unique question for each question_count:
    - 5 → addition(med)
    - 4 → subtraction(hard)
    - 3 → square(hard)
    - 2 → divide(med)
    - 1 → divide(hard)
    """
    if self.question_count == 5:
      problem = self.addition(1)
    elif self.question_count == 4:
      problem = self.subtraction(2)
    elif self.question_count == 3:
      problem = self.square(2)
    elif self.question_count == 2:
      problem = self.division(1)
    else:
      problem = self.division(2)

    [self.question, self.answer] = problem

  def next_question_prep(self):
    self.question_count -= 1
    if self.question_count == 3:
      self.required_item = "Square"

    if self.question_count == 2:
      self.required_item = "Divid"


class ArtifactGuardian(CanMultiply, CanSquare, CanDivide, CanRoot, CanAdd, CanSubtract, Guardian):

  def __init__(self):
    super().__init__("Artifact Guardian",
                     "The final challenge! If you run away, your questions won't get reset.")
    # The artifact Guardian holds it's own questions and tries.
    # You can run away and the question count won't go down.
    self.question_count = 10
    self.try_count      = 3
    self.required_item  = "Multip"

  def prep_quiz(self, player):
    """
    Sets the battle's try count and question count
    to the Guardian's saved values.

    This allows the player to run away and come back
    without resetting their questions. 
    """
    self.player          = player
    self.question        = None
    self.try_count       = 3
    self.question_count += 1
    # We set question_count + 1 because next_question_prep
    # will decrease it by one automatically
    self.next_question_prep()

  def math_question(self):
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
    if self.question_count > 8:
      problem = self.multiplication(2)

    elif self.question_count > 7:
      problem = self.square(1)
    elif self.question_count > 6:
      problem = self.square(2)

    elif self.question_count > 4:
      problem = self.division(2)

    elif self.question_count > 3:
      problem = self.root(1)
    elif self.question_count > 2:
      problem = self.root(2)

    elif self.question_count > 1:
      problem = self.addition(2)
    else:
      problem = self.subtraction(2)

    [self.question, self.answer] = problem

  def next_question_prep(self):
    self.question_count -= 1
    if self.question_count == 10:
      self.required_item = "Multip"

    if self.question_count == 8:
      self.required_item = "Square"

    if self.question_count == 6:
      self.required_item = "Divid"

    if self.question_count == 4:
      self.required_item = "Radical"

    if self.question_count == 2:
      self.required_item = "Calculator"
