from utils.playsound_copy import playsound
from assets.assets import *
import time
from multiprocessing import Process


class Player:
    """
    A Music/Sound Player.

    Initializes with an album to hold all
    of the tracks the Player can play.
    Can play tracks once, or loop.
    """

    def __init__(self, album):
        self.album = album
        self.current_track = None
        # Process of the current track, if we're looping
        self.process = None
        # stop() function to stop playback
        self.stop = None

    def start(self, wait=False):
        """
        Starts playing the current track.

        Sets the stop() function, and returns the track duration.
        """
        if self.current_track is None:
            # no track? Return
            return

        sound_info = playsound(self.current_track, wait)
        self.stop = sound_info["stop"]
        return sound_info["duration"]

    def loop_track(self):
        """
        Starts the track, 
        waits the duration of the track,
        and then replays.
        """
        while True:
            duration = self.start()
            time.sleep(duration)

    def play_track(self, num, loop):
        """
        Plays the requested track.

        If loop is set to true, creates a separate
        process to auto loop the track in the background.
        """
        if not (0 <= num < len(self.album)):
            # If our track number isn't in our album, return
            return

        self.current_track = self.album[num]
        if loop:
            self.process = Process(target=self.loop_track)
            self.process.start()
        else:
            self.start()

    def stop_track(self):
        """
        Stops playing track.

        Calls stop() if exists.
        Terminates the process if exists.
        Sets current_track, stop, and process to None.
        """
        if self.stop is not None and callable(self.stop):
            self.stop()

        if isinstance(self.process, Process):
            self.process.terminate()

        self.stop, self.process, self.current_track = None, None, None


class MusicPlayer(Player):

    def __init__(self):
        super().__init__(music_files)

    def play_track(self, num=0, loop=True):
        """
        Plays the desired track.

        If another track is playing,
        stops current track before starting anew.

        Tracks:
        -   0 -> main_track
        -   1 -> intro_track
        """
        if self.current_track is not None:
            super().stop_track()
        return super().play_track(num=num, loop=loop)


class SoundPlayer(Player):

    def __init__(self):
        super().__init__(sound_files)

    def play_track(self, num=0, loop=False):
        """
        Tracks:
        -   0 -> damage
        -   1 -> monster_death
        -   2 -> correct answer
        -   3 -> incorrect answer
        -   4 -> monster spawn
        -   5 -> menu sound
        -   6 -> menu fail
        -   7 -> run away
        """
        return super().play_track(num=num, loop=loop)
