from .game_state import GameState
from views.controls_view import Controls
from utils.display_screen import display_screen, fade_out, print_and_wait


class BattleController:
  """Main loop for battles in the adventure game"""

  def __init__(self, adv):
    self.adv          = adv
    self.control_enum = Controls.BATTLE
    self.battle       = None

  def initialize_battle(self, battle):
    """Tell the guardian to prep the quiz with the initially required item"""
    self.battle = battle
    self.battle.guardian.prep_quiz()

  def is_answering_math(self, user_in):
    """Returns true if user is answering a math problem during battle"""
    if user_in[0] == "answer":
      return len(user_in) > 1 and user_in[1].isdigit()
    else:
      return user_in[0].isdigit()

  def quit_game(self, user_in):
    self.adv.sound_player.play_track(5)
    sure = input(
        "Quit the Game. Are you sure? [Y/N]>> ").lower().strip()
    if sure == "y":
      self.adv.playing_game = False

  def run_away(self, user_in):
    """
    Running away?
    * Lose the battle,
    * set self.win_or_lose to None ('cause we didn't win or lose),
    * and self.end_of_battle()
    """
    self.battle.lose()
    self.end_of_battle(None)

  def use_item(self, user_in):
    """
    Check that the user tries to use a valid item,
    then uses the item in battle.
    """
    if len(user_in) < 2:
      # User didn't actually type an item to use? Error message 'em
      self.adv.sound_player.play_track(6)
      print_and_wait(
          "~RPlease type the ~e~c(name)~R of the item you wish to use.")
    else:
      item_name = " ".join(user_in[1:])
      correct_item = self.battle.check_item(item_name)

      if correct_item[0] is None:
        # No item? Display error message
        print_and_wait(f"~RYou do not have ~e~c({item_name})~R!")
      elif correct_item[0]:
        # Correct item? Make the guardian dance a little, and display text
        item_name = correct_item[1]
        self.adv.sound_player.play_track(2)
        display_screen(*self.battle.display_info("correct"), self.control_enum)
        print_and_wait(f"~WYou used ~e~c({item_name})~W!", 1)
      else:
        # Incorrect item? Angry guardian!
        item_name = correct_item[1]
        self.adv.sound_player.play_track(3)
        all_info = self.battle.display_info("incorrect")
        display_screen(*all_info, self.control_enum)
        print_and_wait(
            f"~c({item_name}) ~Ris not the correct item!", 1)

  def answer_question(self, user_in):
    if user_in[0] == "answer":
      # If the user typed the word answer, the second 'word' is their math answer
      answer = int(user_in[1])
    else:
      # Else, the first 'word' is their math answer
      answer = int(user_in[0])

    correct_answer = self.battle.check_answer(answer)
    if correct_answer:
      # Correct answer? Make the guardian dance a little, and display text
      self.adv.sound_player.play_track(2)
      display_screen(*self.battle.display_info("correct"), self.control_enum)
      print_and_wait(f"~Y{answer} ~Wis correct!", 1)
    else:
      # Incorrect answer? Angry guardian!
      self.adv.sound_player.play_track(3)
      display_screen(*self.battle.display_info("incorrect"), self.control_enum)
      print_and_wait(
          f"~Y{answer} ~Ris not the correct answer!", 1)

    # Check if we've won or lost
    # If we have, break the loop
    win_or_lose = self.battle.check_victory()
    if win_or_lose is not None:
      self.end_of_battle(win_or_lose)

  def end_of_battle(self, win_or_lose):
    self.battle = self.battle

    if win_or_lose is None:
      # Running away
      self.adv.sound_player.play_track(7)
      print_and_wait("~YYou ran away!", 1.3)

    elif win_or_lose is True:
      # Winning the battle
      self.adv.sound_player.play_track(1)
      print_and_wait(f"~YYou defeated the ~W{self.battle.guardian.name}~Y!", 2)
      if self.battle.guardian.name[:8] == "Artifact":
        # Stop music for dramatic moment
        self.adv.music_player.stop_track()
        self.adv.music_player.turn_off()

    else:
      # Losing the battle
      self.adv.sound_player.play_track(0)
      print(color("~YYou lost the battle! You have to run away!"))
      time.sleep(0.6)
      self.adv.sound_player.play_track(0)
      time.sleep(0.6)
      self.adv.sound_player.play_track(0)
      time.sleep(0.8)

    fade_out(*self.battle.display_info(), self.control_enum)
    self.adv.game_state = GameState.TRAVEL

  def main(self):
    # Create a question
    self.battle.create_question()
    # Display battle info and wait for input
    display_screen(*self.battle.display_info(), self.control_enum)
    user_in = input(">> ").lower().strip().split(" ")

    if user_in[0] == "q":
      self.quit_game(user_in)
    elif " ".join(user_in) == "run away":
      self.run_away(user_in)
    elif user_in[0] == "use":
      self.use_item(user_in)
    elif self.is_answering_math(user_in):
      self.answer_question(user_in)
    else:  # Not a proper input? Display help message
      print_and_wait(
          "~RYou must ~Wuse ~e~c(item)~R, ~Wanswer~R the math problem, or ~Wrun away~R!")
