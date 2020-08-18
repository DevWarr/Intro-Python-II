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
        self.adv.player.current_room
    ]
    self.adv.display.update(*display_info)

  def quit_game(self, user_in):
    self.adv.playing_game = False

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
      self.adv.display.print_and_wait("~RThere is no room that way . . .", 1)

  def take_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success, item_name = self.adv.player.take_item(item_name)
      if success is True:
        success_str = f"You took ~c({item_name})~e."
        self.adv.sound_player.play_track(5)
        self.adv.display.update(self.adv.player, self.adv.player.current_room)
        self.adv.display.print_and_wait(success_str)
        return
      elif success is False:
        error_str = "~RYour inventory is full.~e"
      else:
        error_str = f"~c({item_name})~R is not in the room.~e"
    else:
      error_str = "~RPlease type the ~e~c(name)~R of the item you wish to take."
    self.adv.sound_player.play_track(6)
    self.adv.display.print_and_wait(error_str)

  def drop_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success, item_name = self.adv.player.drop_item(item_name)
      if success:
        # Item dropped successfully
        success_str = f"You dropped ~c({item_name})~e."
        self.adv.sound_player.play_track(5)
        self.adv.display.update(self.adv.player, self.adv.player.current_room)
        self.adv.display.print_and_wait(success_str)
        return
      else:
        # Item not in room
        error_str = f"~c({item_name})~R is not in your inventory.~e"
    else:
      # User did not specify an item
      error_str = "~RPlease type the ~e~c(name)~R of the item you wish to drop."
    self.adv.sound_player.play_track(6)
    self.adv.display.print_and_wait(error_str)

  def use_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success = self.adv.player.use_item(item_name)
      if success[0] is None:
        self.adv.sound_player.play_track(6)
        self.adv.display.print_and_wait(
            f"~c({name})~R is not in your inventory.")
      elif success[0]:
        self.play_credits()
        self.adv.playing_game = False
        return
      else:
        self.adv.sound_player.play_track(6)
        self.adv.display.print_and_wait(
            f"~RYou can't use ~e~c({success[1]}) ~Rhere.")
    else:
      self.adv.sound_player.play_track(6)
      self.adv.display.print_and_wait(
          "~RPlease type the ~e~c(name)~R of the item you wish to use.")

  def invalid_input(self, user_in):
    self.adv.sound_player.play_track(6)
    self.adv.display.print_and_wait(
        "~RInvalid input. Please try again . . .", 1)

  def play_credits(self):
    # Clear the screen, cut the music
    self.adv.display.black_out()
    self.adv.sound_player.play_track(7)
    time.sleep(0.3)
    self.adv.music_player.stop_track()
    time.sleep(0.6)

    # Display credits with the correct jingle
    self.adv.sound_player.play_track(2)
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
    self.adv.display.update(self.guardian)

  def is_answering_math(self, user_in):
    """Returns true if user is answering a math problem during battle"""
    if user_in[0] == "answer":
      return len(user_in) > 1 and user_in[1].isdigit()
    else:
      return user_in[0].isdigit()

  def quit_game(self, user_in):
    self.adv.sound_player.play_track(5)
    sure = self.adv.display.get_input(
        "Quit the Game. Are you sure? [Y/N]>> ").lower()
    if sure == "y":
      self.adv.playing_game = False

  def use_item(self, user_in):
    """
    Check that the user tries to use a valid item,
    then uses the item in battle.
    """
    if len(user_in) < 2:
      # User didn't actually type an item to use? Error message 'em
      self.adv.sound_player.play_track(6)
      self.adv.display.print_and_wait(
          "~RPlease type the ~e~c(name)~R of the item you wish to use.")
      return

    item_name = " ".join(user_in[1:])
    used_item = self.adv.player.use_item(item_name)

    if used_item[0] is None:
      # No item? Display error message
      self.adv.display.print_and_wait(
          f"~RYou do not have ~e~c({item_name})~R!")
      return

    item_name = used_item[1]
    correct_item = self.guardian.check_item(item_name)
    if correct_item:
      # Correct item? Make the guardian dance a little, and display text
      self.adv.sound_player.play_track(2)
      self.adv.display.update(self.guardian)
      self.adv.display.print_and_wait(f"~WYou used ~e~c({item_name})~W!", 1)
    else:
      # Incorrect item? Angry guardian!
      self.adv.sound_player.play_track(3)
      self.adv.display.update(self.guardian)
      self.adv.display.print_and_wait(
          f"~c({item_name}) ~Ris not the correct item!", 1)

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
      self.adv.display.print_and_wait(f"~Y{answer} ~Wis correct!", 1)
    else:
      # Incorrect answer? Angry guardian!
      self.adv.sound_player.play_track(3)
      self.adv.display.update(self.guardian)
      self.adv.display.print_and_wait(
          f"~Y{answer} ~Ris not the correct answer!", 1)

  def end_of_battle(self, win_or_lose):

    if win_or_lose is None:
      # Running away
      self.adv.sound_player.play_track(7)
      self.adv.player.run_away()
      self.adv.display.print_and_wait("~YYou ran away!", 1.3)

    elif win_or_lose is True:
      # Winning the battle
      self.adv.sound_player.play_track(1)
      self.adv.display.print_and_wait(
          f"~YYou defeated the ~W{self.guardian.name}~Y!", 2)
      if self.guardian.name[:8] == "Artifact":
        # Stop music for dramatic moment
        self.adv.music_player.stop_track()
        self.adv.music_player.turn_off()

    else:
      # Losing the battle
      self.adv.player.run_away()
      self.adv.sound_player.play_track(0)
      self.adv.display.print_and_wait(
          "~YYou lost the battle! You have to run away!", 0.1)
      time.sleep(0.5)
      self.adv.sound_player.play_track(0)
      time.sleep(0.6)
      self.adv.sound_player.play_track(0)
      time.sleep(0.8)

    self.adv.display.fade_out()
    self.adv.change_controller(TravelController(self.adv))

  def main(self, user_in):
    user_in = user_in.lower().split(" ")
    if user_in[0] == "q":
      self.quit_game(user_in)
      return
    elif " ".join(user_in) == "run away":
      self.end_of_battle(None)
      return

    elif user_in[0] == "use":
      self.use_item(user_in)
    elif self.is_answering_math(user_in):
      self.answer_question(user_in)
    else:  # Not a proper input? Display help message
      self.adv.display.print_and_wait(
          "~RYou must ~Wuse ~e~c(item)~R, ~Wanswer~R the math problem, or ~Wrun away~R!")

    # Check if we've won or lost
    # If we have, break the loop
    win_or_lose = self.guardian.check_victory()
    if win_or_lose is not None:
      self.end_of_battle(win_or_lose)
      return
    self.guardian.create_question()
    self.adv.display.update(self.guardian)
