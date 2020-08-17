from controllers.main_controller import AdventureGame
from multiprocessing import freeze_support
from os import terminal_size


if __name__ == "__main__":
  # A Windows fix to allow multiprocessing
  freeze_support()
  # Wrap everything in a try/except, so if an error is thrown
  #     we stop our players and exit peacefully
  try:
    adv = AdventureGame()
    terminal_size((82, 16))
    adv.main()
  except Exception as e:
    adv.music_player.stop_track()
    adv.sound_player.stop_track()
    raise e
