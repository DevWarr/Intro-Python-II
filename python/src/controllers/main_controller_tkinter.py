from .intro_controller import IntroController
from models.game_map import GameMap
from views.tkinter_view import TkinterView
from utils.music_pygame import PyGameMusicPlayer, PyGameSoundPlayer

class TkinterController:
  """Controller paired with the TkinterView class"""

  def __init__(self):
    self.game_map     = GameMap()
    self.player       = None  # Waits until player is created

    self.music_player = PyGameMusicPlayer()
    self.sound_player = PyGameSoundPlayer()

    self.display      = TkinterView(self)
    self.controller   = None

    # self.music_player.turn_off()

  def quit_game(self):
    """Stop the music/sound players before quitting the game."""
    self.music_player.stop_track()
    self.sound_player.stop_track()
    root = self.display.root
    if root and hasattr(root, "destroy"):
      self.display.root.destroy()

  def change_controller(self, new_controller):
    self.controller = new_controller
    self.display.update_controller()

  def start_game(self):
    self.music_player.play_track(1)
    self.change_controller(IntroController(self))
    self.display.root.mainloop()
