from utils.colors import color


class Battle:

  def __init__(self, player, guardian, game_map):
    self.map = game_map
    self.player = player

    # Guardian set up for the battle
    self.guardian = guardian
    self.guardian.battle = self

    self.try_count = 3
    self.question_count = 5
    self.question = None
    self.answer = None
    self.required_item = None

  def check_victory(self):
    """
    Checks if the player has won/lost the battle.

    Returns the value of the win/lose functions,
    or returns None.
    """
    if self.try_count == 0:
      return self.lose()
    elif self.question_count == 0:
      return self.win()
    else:
      return None

  def create_question(self):
    """
    Creates a question if one does not already exist.
    """
    if self.question is None:
      # If there's no question, create one
      print(self.required_item)
      if self.required_item is not None:
        # Required item? Create a question for it
        self.question = f"~W{self.guardian.name}~e is requesting you use ~c({self.required_item})~e"

      else:
        # Otherwise, call create_question()
        self.guardian.create_question()

  def check_item(self, name):
    """
    Checks if the used item matches what is required.

    If:
    - Player doesn't have item     → (None,)
    - Item does not match required → (False, item.name)
    - Item matches required        → (True, item.nam)
    """
    item = self.player.get_item(name)
    if item is None:
      return (None,)
    elif item.name == self.required_item:
      self.required_item = None
      self.question = None
      return (True, item.name)
    else:
      self.try_count -= 1
      return (False, item.name)

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
      self.guardian.next_question_prep()
      return True
    else:
      self.try_count -= 1
      return False

  def lose(self):
    """Handles losing a battle. Returns False when complete."""
    # If we lose, the guardian wins
    self.guardian.win()
    # Knock the player back to their previous location
    self.map.position = [*self.map.prev]
    return False

  def win(self):
    """Handles winning a battle. Returns true when complete."""
    # If we win, the guardian loses
    self.guardian.lose()
    return True

  def display_info(self, pose="stand"):
    """
    Displays Player info and Room info,
    formatted for the utils.display_screen function.

    pose MUST be either:
    - "stand"
    - "correct"
    - "incorrect

    Returns an array containing:
    - The guardian's current pose
    - The current try_count and question_count
    - Player information
    - Guardian info, and question
    """
    return [
        self.guardian.poses[pose],
        f"Questions remaining: ~W{self.question_count}~e\n\nTries left: ~W{self.try_count}~e",
        str(self.player),
        str(self.guardian) + "\n" + str(self.question)
    ]
