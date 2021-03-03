from views.controls_view import Controls
import time


class TravelController:
  """Travel Loop for the adventure game"""

  def __init__(self, adv):
    self.adv = adv
    self.control_enum = Controls.SIMPLE
    self.branch_table = {
        'q': self.quit_game,
        'o': self.toggle_options,
        'n': self.move,
        's': self.move,
        'e': self.move,
        'w': self.move,
        'take': self.take_item,
        'drop': self.drop_item,
        'use': self.use_item
    }
    display_info = [
        self.adv.game_map,
        self.adv.player,
        self.adv.player.current_room,
        self.control_enum
    ]
    self.adv.display.update(*display_info)

  def quit_game(self, user_in):
    self.adv.quit_game()

  def toggle_options(self, user_in):
    self.adv.sound_player.play_track(5)
    self.control_enum = Controls.swap_controls(self.control_enum)
    self.adv.display.update(self.control_enum)

  def look_for_fight(self):
    guardian = self.adv.player.check_for_guardian()
    if guardian is not None:
      # If there is a guardian, start battle
      self.adv.sound_player.play_track(4)
      self.adv.display.fade_out()
      self.adv.change_controller(BattleController(self.adv, guardian))

  def move(self, user_in):
    success = self.adv.player.move(user_in[0])
    if success:
      self.adv.sound_player.play_track(5)
      self.adv.display.update(
          self.adv.game_map, self.adv.player, self.adv.player.current_room)
      self.look_for_fight()
    else:
      self.adv.sound_player.play_track(6)
      error_str = "There is no room that way . . ."
      self.adv.display.send_response("error", error_str, sec_to_wait=1)

  def take_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success, item_name = self.adv.player.take_item(item_name)
      if success is True:
        success_str = "You took ({})."
        self.adv.sound_player.play_track(5)
        self.adv.display.update(self.adv.player, self.adv.player.current_room)
        self.adv.display.send_response("info", success_str, item_name)
        return
      elif success is False:
        error_str = "Your inventory is full."
        self.adv.sound_player.play_track(6)
        self.adv.display.send_response("error", error_str)
        return
      else:
        error_str = "({}) is not in the room."
        error_val = item_name
    else:
      error_str = "Please type the ({}) of the item you wish to take."
      error_val = "name"
    self.adv.sound_player.play_track(6)
    self.adv.display.send_response("error", error_str, error_val)

  def drop_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success, item_name = self.adv.player.drop_item(item_name)
      if success:
        # Item dropped successfully
        success_str = "You dropped ({})."
        self.adv.sound_player.play_track(5)
        self.adv.display.update(self.adv.player, self.adv.player.current_room)
        self.adv.display.send_response("info", success_str, item_name)
        return
      else:
        # Item not in room
        error_str = "({}) is not in your inventory."
        error_val = item_name
    else:
      # User did not specify an item
      error_str = "Please type the ({}) of the item you wish to drop."
      error_val = "name"
    self.adv.sound_player.play_track(6)
    self.adv.display.send_response("error", error_str, error_val)

  def use_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success, item_name = self.adv.player.use_item(item_name)
      if success:
        self.play_credits()
        return
      elif success is None:
        error_str = "({}) is not in your inventory."
        error_val = item_name
      else:
        error_str = "You can't use ({}) here."
        error_val = item_name
    else:
      error_str = "Please type the ({}) of the item you wish to use."
      error_val = "name"
    self.adv.sound_player.play_track(6)
    self.adv.display.send_response("error", error_str, error_val)

  def invalid_input(self, user_in):
    self.adv.sound_player.play_track(6)
    error_str = "Invalid input. Please try again . . ."
    self.adv.display.send_response("error", error_str, sec_to_wait=1)

  def play_credits(self):
    # Clear the screen, cut the music
    self.adv.display.show_credits()

  def main(self, user_in):
    user_in = user_in.lower().split(" ")
    function = self.branch_table.get(user_in[0], self.invalid_input)
    function(user_in)


class BattleController:
  """Main loop for battles in the adventure game"""

  def __init__(self, adv, guardian):
    self.adv          = adv
    self.control_enum = Controls.BATTLE
    self.guardian     = guardian
    # Tell the guardian to prep the quiz with the initially required item
    self.guardian.prep_quiz(self.adv.player)
    self.guardian.create_question()
    self.adv.display.update(self.guardian, self.control_enum)

  def is_answering_math(self, user_in):
    """Returns true if user is answering a math problem during battle"""
    if user_in[0] == "answer":
      return len(user_in) > 1 and user_in[1].isdigit()
    else:
      return user_in[0].isdigit()

  def confirm_quit(self):
    error_str = "If you are sure you want to quit the game, type {}."
    self.adv.display.send_response("error", error_str, "quit")

  def quit_game(self):
    self.adv.quit_game()

  def use_item(self, user_in):
    """
    Check that the user tries to use a valid item,
    then uses the item in battle.
    """
    if len(user_in) < 2:
      # User didn't actually type an item to use? Error message 'em
      self.adv.sound_player.play_track(6)
      error_str = "Please type the ({}) of the item you wish to use."
      self.adv.display.send_response("error", error_str, "name")
      return

    item_name = " ".join(user_in[1:])
    used_item = self.adv.player.use_item(item_name)

    if used_item[0] is None:
      # No item? Display error message
      error_str = "You do not have ({})!"
      self.adv.display.send_response("error", error_str, item_name)
      return

    item_name = used_item[1]
    correct_item = self.guardian.check_item(item_name)
    if correct_item:
      # Correct item? Make the guardian dance a little, and display text
      self.adv.sound_player.play_track(2)
      self.adv.display.update(self.guardian)
      self.adv.display.send_response(
          "battle", "You used ({})!", item_name, sec_to_wait=1, cb=self.check_battle_condition)
    else:
      # Incorrect item? Angry guardian!
      self.adv.sound_player.play_track(3)
      self.adv.display.update(self.guardian)
      self.adv.display.send_response(
          "error", "({}) is not the correct item!", item_name, sec_to_wait=1, cb=self.check_battle_condition)

  def answer_question(self, user_in):
    if user_in[0] == "answer":
      # If the user typed the word answer, the second 'word' is their math answer
      answer = int(user_in[1])
    else:
      # Else, the first 'word' is their math answer
      answer = int(user_in[0])

    correct_answer = self.guardian.check_answer(answer)
    if correct_answer:
      # Correct answer? Make the guardian dance a little, and display text
      self.adv.sound_player.play_track(2)
      self.adv.display.update(self.guardian)
      self.adv.display.send_response(
          "battle", "{} is correct!", answer, sec_to_wait=1, cb=self.check_battle_condition)
    else:
      # Incorrect answer? Angry guardian!
      self.adv.sound_player.play_track(3)
      self.adv.display.update(self.guardian)
      self.adv.display.send_response(
          "error", "{} is not the correct answer!", answer, sec_to_wait=1, cb=self.check_battle_condition)

  def end_of_battle(self, win_or_lose):

    if win_or_lose is None:
      # Running away
      self.adv.sound_player.play_track(7)
      self.adv.player.run_away()
      self.adv.display.send_response(
          "battle", "You ran away!", sec_to_wait=1.3, cb=self.leave_battle)

    elif win_or_lose is True:
      # Winning the battle
      self.adv.sound_player.play_track(1)
      self.adv.display.send_response(
          "battle", "You defeated the {}!", self.guardian.name, sec_to_wait=2, cb=self.leave_battle)
      if self.guardian.name[:8] == "Artifact":
        # Stop music for dramatic moment
        self.adv.music_player.stop_track()
        self.adv.music_player.turn_off()

    else:
      # Losing the battle
      self.adv.player.run_away()
      self.adv.display.lose_battle(cb=self.leave_battle)

  def leave_battle(self):
    self.adv.display.fade_out()
    self.adv.change_controller(TravelController(self.adv))

  def invalid_input(self):
    error_str = "You must {} ({}), {} the math problem, or {}!"
    error_vals = ["use", "item", "answer", "run away"]
    self.adv.display.send_response("error", error_str, *error_vals)

  def check_battle_condition(self):
    """
    Check if the player has won or lost the battle.
    If we have won or lost, break
    """
    win_or_lose = self.guardian.check_victory()
    if win_or_lose is not None:
      self.end_of_battle(win_or_lose)
    else:
      self.guardian.create_question()
      self.adv.display.update(self.guardian)

  def main(self, user_in):
    user_in = user_in.lower().split(" ")
    if user_in[0] == "q":
      self.confirm_quit()
      return
    elif user_in[0] == "quit":
      self.quit_game()
      return
    elif " ".join(user_in) == "run away":
      self.end_of_battle(None)
      return
    elif user_in[0] == "use":
      self.use_item(user_in)
    elif self.is_answering_math(user_in):
      self.answer_question(user_in)
    else:
      self.invalid_input()
