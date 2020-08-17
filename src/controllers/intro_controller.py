from models.room import DebugRoom
from models.player import DebugPlayer, GamePlayer
from models.game_map import Map
from utils.display_screen import display_screen, fade_out, print_and_wait
from utils.colors import color
from assets.guardian_poses import multip_guardian
from .game_state import GameState
from views.controls_view import Controls
from time import sleep


class IntroController:
  """Intro before the main game starts."""

  def __init__(self, adv):
    self.adv = adv
    self.intro_text = [
        multip_guardian()["stand"],
        None,
        DebugPlayer("Winner"),
        DebugRoom(),
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
      sleep(0.1)
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
