from classes.room import Room
from classes.player import GamePlayer, DebugPlayer
from classes.item import Item
from classes.game_map import Map
from classes.battle import Battle
from utils.colors import color
from utils.music import MusicPlayer, SoundPlayer
from utils.display_screen import display_screen, print_and_wait, fade_out
from views.controls_view import Controls
from assets.guardian_poses import multip_guardian
from os import terminal_size
from multiprocessing import freeze_support
import time
from enum import Enum


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

  def quit_game(self, user_in):
    self.adv.playing_game = False

  def toggle_options(self, user_in):
    self.adv.sound_player.play_track(5)
    self.control_enum = Controls.swap_controls(self.control_enum)

  def look_for_fight(self):
    guardian = self.adv.game_map.check_for_guardian()
    if guardian is not None:
      # If there is a guardian, start battle
      self.adv.sound_player.play_track(4)
      new_battle = Battle(self.adv.game_map.player,
                          guardian, self.adv.game_map)
      self.adv.battle.initialize_battle(new_battle)
      self.adv.game_state = GameState.BATTLE
      fade_out(*self.adv.game_map.display_info(), self.control_enum)

  def move(self, user_in):
    success = self.adv.game_map.move(user_in[0])
    if success:
      self.adv.sound_player.play_track(5)
      self.look_for_fight()
    else:
      self.adv.sound_player.play_track(6)
      print_and_wait("~RThere is no room that way . . .", 1)

  def take_item(self, user_in):
    if len(user_in) > 1:
      self.adv.sound_player.play_track(5)
      item_name = " ".join(user_in[1:])
      print_and_wait(self.adv.game_map.take_item(item_name))
    else:
      self.adv.sound_player.play_track(6)
      print_and_wait(
          "~RPlease type the ~e~c(name)~R of the item you wish to take.")

  def drop_item(self, user_in):
    if len(user_in) > 1:
      self.adv.sound_player.play_track(5)
      item_name = " ".join(user_in[1:])
      print_and_wait(self.adv.game_map.drop_item(item_name))
    else:
      self.adv.sound_player.play_track(6)
      print_and_wait(
          "~RPlease type the ~e~c(name)~R of the item you wish to drop.")

  def use_item(self, user_in):
    if len(user_in) > 1:
      item_name = " ".join(user_in[1:])
      success = self.adv.game_map.use_item(item_name)
      if success[0] is None:
        self.adv.sound_player.play_track(6)
        print_and_wait(f"~c({name})~R is not in your inventory.")
      elif success[0]:
        self.play_credits()
        self.adv.playing_game = False
        return
      else:
        self.adv.sound_player.play_track(6)
        print_and_wait(f"~RYou can't use ~e~c({success[1]}) ~Rhere.")
    else:
      self.adv.sound_player.play_track(6)
      print_and_wait(
          "~RPlease type the ~e~c(name)~R of the item you wish to use.")

  def invalid_input(self, user_in):
    self.adv.sound_player.play_track(6)
    print_and_wait("~RInvalid input. Please try again . . .", 1)

  def play_credits(self):
    # Clear the screen, cut the music
    display_screen("", "", "", "", Controls.EMPTY)
    self.adv.sound_player.play_track(7)
    time.sleep(0.3)
    self.adv.music_player.stop_track()
    time.sleep(0.6)

    # Display credits with the correct jingle
    display_screen(
        "", "\n\n\n~WThanks for playing!~e\n  - Devin Warrick", "", "", Controls.EMPTY)
    self.adv.sound_player.play_track(2)
    time.sleep(3)

  def main(self):

    # Display map screen and wait for input
    display_screen(*self.adv.game_map.display_info(), self.control_enum)
    user_in = input(">> ").lower().strip().split(" ")

    function = self.branch_table.get(user_in[0], self.invalid_input)
    function(user_in)


class IntroController:
  """Intro before the main game starts."""

  def __init__(self, adv):
    self.adv = adv
    self.intro_text = [
        multip_guardian()["stand"],
        None,
        DebugPlayer("Winner"),
        "|——————————————————————————————————————————————————————————————————————————————|\n~WThis adventure game requires a terminal 80 characters wide and 15 lines tall.~e\nIf you can't see all of this text, please resize your terminal.",
        Controls.INTRO
    ]

  def setup_player(self, user_in):
    player = GamePlayer(user_in)
    self.adv.game_map = Map(player)

    self.adv.music_player.stop_track()
    self.adv.sound_player.play_track(5)
    for i in range(0, 6):
      display_screen(*self.intro_text)
      print("\n")
      print(color("~BStarting Game ." + " ." * (i % 3)))
      time.sleep(0.1)
    fade_out(*self.intro_text)

  def main(self):
    # Display the intro and wait for input
    display_screen(*self.intro_text)
    print("\n")
    user_in = input(">> ").strip()

    if user_in == 'q':
      self.adv.playing_game = False

    elif len(user_in) == 0:
      # No name? Reset the loop
      return

    elif len(user_in) > 15:
      # Name too long? Sorry bub.
      print_and_wait(
          "~RThat name is too long! Please have a name less than 15 characters.")

    else:
      # Valid input? Use it as the name
      self.setup_player(user_in)
      self.adv.game_state = GameState.TRAVEL
      return


class GameState(Enum):
  INTRO  = 0
  TRAVEL = 1
  BATTLE = 2


class AdventureGame:

  def __init__(self):
    self.game_state   = GameState.INTRO
    self.playing_game = True
    self.game_map     = None  # Waits until player is created

    self.intro        = IntroController(self)
    self.travel       = TravelController(self)
    self.battle       = BattleController(self)

    self.music_player = MusicPlayer()
    self.sound_player = SoundPlayer()

  def main(self):
    terminal_size((82, 16))
    while self.playing_game:
      if self.game_state == GameState.INTRO:
        self.music_player.play_track(1)
        self.intro.main()
      elif self.game_state == GameState.TRAVEL:
        self.music_player.play_track(0)
        self.travel.main()
      elif self.game_state == GameState.BATTLE:
        self.battle.main()

    self.music_player.stop_track()
    self.sound_player.stop_track()


if __name__ == "__main__":
  # A Windows fix to allow multiprocessing
  freeze_support()
  # Wrap everything in a try/except, so if an error is thrown
  #     we stop our players and exit peacefully
  try:
    adv = AdventureGame()
    adv.main()
  except Exception as e:
    adv.music_player.stop_track()
    adv.sound_player.stop_track()
    raise e
