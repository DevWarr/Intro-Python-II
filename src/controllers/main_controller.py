from .intro_controller import IntroController
from .travel_controller import TravelController
from .battle_controller import BattleController
from models.game_map import GameMap
from utils.music import MusicPlayer, SoundPlayer


class AdventureGame:

  def __init__(self):
    self.playing_game = True
    self.game_map     = GameMap()
    self.player       = None  # Waits until player is created

    self.controller   = IntroController(self)

    self.music_player = MusicPlayer()
    self.sound_player = SoundPlayer()
    self.music_player.turn_off()

  def quit_game(self):
    """Stop the music/sound players before quitting the game."""
    self.music_player.stop_track()
    self.sound_player.stop_track()

  def change_controller(new_controller):
    self.controller = new_controller

  def main(self):
    self.music_player.play_track(1)

    while self.playing_game:
      self.controller.main()

    self.quit_game()
