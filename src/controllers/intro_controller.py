from .game_controllers import TravelController
from models.room import DebugRoom
from models.player import DebugPlayer, GamePlayer
from models.game_map import GameMap
from models.guardians import MultipGuardian
from views.controls_view import Controls


class IntroController:
  """Intro before the main game starts."""

  def __init__(self, adv):
    self.adv = adv
    intro_text = [
        MultipGuardian(),
        DebugPlayer("Winner"),
        DebugRoom(),
        Controls.INTRO
    ]
    self.adv.display.update(*intro_text)

  def setup_player(self, user_in):
    self.adv.player = GamePlayer(user_in, self.adv.game_map)

    self.adv.music_player.stop_track()
    self.adv.sound_player.play_track(5)
    
    self.adv.display.start_game()
    self.adv.display.fade_out()
    
    self.adv.music_player.play_track(0)
    self.adv.change_controller(TravelController(self.adv))

  def main(self, user_in):

    if user_in == 'q':
      self.adv.playing_game = False

    elif len(user_in) == 0:
      # No name? Reset the loop
      return

    elif len(user_in) > 15:
      # Name too long? Sorry bub.
      error_str = "~RThat name is too long! Please have a name less than 15 characters."
      self.adv.display.print_and_wait(error_str)

    else:
      # Valid input? Use it as the name
      self.setup_player(user_in)
      return
