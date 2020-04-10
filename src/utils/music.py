from utils.playsound_copy import playsound
from assets.assets import main_track, intro_track
import time
import threading


class Music(threading.Thread):

    def __init__(self, track):
        super().__init__()
        self.__play = track
        self.__loop = False
        self.__playing = False

    @property
    def playing(self):
        return self.__playing

    def run(self):
        self.__playing = True
        while True:
            # While we're looping, loop the track
            sound_info = playsound(self.__play, False)
            sleep_time = int(sound_info['duration'])
            stop = sound_info['stop']
            for i in range(0, sleep_time*100):
                # While we're playing,
                # sleep at small amounts continuously.
                if self.__playing:
                    time.sleep(0.01)
                else:
                    # If we stop playing,
                    # Stop looping and break
                    self.__loop = False
                    stop()
                    break
            if not self.__loop:
                break

    def play_track(self, loop=True):
        self.__loop = loop
        self.start()

    def stop_loop(self):
        self.__loop = False

    def stop_track(self):
        self.__playing = False

class MusicPlayer:

    def __init__(self):
        self.album = [main_track, intro_track]
        self.playing = False
        self.track = None
    
    def play_track(self, num=0, loop=True):
        """
        Plays a track from the album.

        num:
        -   0 -> main
        -   1 -> intro

        loop: Determines whether the track will loop or not.

        """
        if 0 <= num < len(self.album):
            self.track = Music(self.album[num])
            self.track.play_track(loop)

    def stop_track(self):
        """Stops track and joins thread to main."""
        if self.track is not None:
            self.track.stop_track()
            self.track.join()
            self.track = None