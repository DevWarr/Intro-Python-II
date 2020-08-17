from .game_state import GameState
from .intro_controller import IntroController
from .travel_controller import TravelController
from .battle_controller import BattleController
from utils.music import MusicPlayer, SoundPlayer



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
