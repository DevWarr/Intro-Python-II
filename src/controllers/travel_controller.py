from .game_state import GameState
from views.controls_view import Controls
from classes.battle import Battle
from utils.display_screen import display_screen, fade_out, print_and_wait
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