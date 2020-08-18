from .intro_controller import IntroController
from models.game_map import GameMap
from utils.music import MusicPlayer, SoundPlayer
from views.terminal_view import TerminalView


class AdventureGame:

  def __init__(self):
    self.playing_game = True
    self.game_map     = GameMap()
    self.player       = None  # Waits until player is created

    self.display      = TerminalView(self)
    self.controller   = None

    self.music_player = MusicPlayer()
    self.sound_player = SoundPlayer()
    # self.music_player.turn_off()

  def quit_game(self):
    """Stop the music/sound players before quitting the game."""
    self.music_player.stop_track()
    self.sound_player.stop_track()

  def change_controller(self, new_controller):
    self.controller = new_controller

  def main(self):
    self.music_player.play_track(1)
    self.controller = IntroController(self)

    while self.playing_game:
      # Display the intro and wait for input
      self.display.display_screen()
      user_in = self.display.get_input(">> ")
      self.controller.main(user_in)

    self.quit_game()
