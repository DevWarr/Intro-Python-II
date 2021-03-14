from multiprocessing import freeze_support
from os import terminal_size
from sys import argv


if __name__ == "__main__":
  # A Windows fix to allow multiprocessing
  freeze_support()
  # Wrap everything in a try/except, so if an error is thrown
  #     we stop our players and exit peacefully
  if len(argv) > 1:
    try:
        from controllers.main_controller_terminal import TerminalController
        adv = TerminalController()
        adv.main()
    except Exception as e:
      adv.music_player.stop_track()
      adv.sound_player.stop_track()
      raise e
  else:
    from controllers.main_controller_tkinter import TkinterController
    adv = TkinterController()
    adv.start_game()
