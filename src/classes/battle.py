from utils.colors import color


class Battle:

    def __init__(self, player, guardian, game_map):
        self.map = game_map
        self.player = player
        self.guardian = guardian
        self.guardian.battle = self
        self.try_count = 3
        self.question_count = 5
        self.question = None
        self.answer = None
        self.required_item = None
        self.guardian.start_quiz()

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
                self.guardian.create_question()
        return self.question

    def item_request(self):
        """
        Creates a question to request for self.item.
        Sets self.question to the newly created question.
        """
        self.question = color(
            f"{self.guardian.name} is requesting you use ~c({self.required_item})")

    def check_item(self, name):
        """
        Checks if the used item matches what is required.

        If:
        - Player doesn't have item     → None
        - Item does not match required → False
        - Item matches required        → True
        """
        item = self.player.get_item(name)
        if item is None:
            return None
        elif item.name == self.required_item:
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
        self.map.position = self.map.prev
        return False
    
    def win(self):
        """Handles winning a battle. Returns true when complete."""
        # If we win, the guardian loses
        self.guardian.lose()
        return True
