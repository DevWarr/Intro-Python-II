from pygame import mixer

class PyGamePlayer:

  def __init__(self):
    mixer.init()
    self.mixer = mixer
    self.on = True
    self.album = []

  def turn_off(self):
    self.on = False

  def turn_on(self):
    self.on = True


class PyGameMusicPlayer(PyGamePlayer):

  def __init__(self):
    super().__init__()
    self.album = music_files

  def play_track(self, num, loop=-1):
    if not self.on:
      return
    track = self.album[num]
    self.mixer.music.load(track)
    self.mixer.music.play(loop)

  def stop_track(self):
    self.mixer.music.stop()


class PyGameSoundPlayer(PyGamePlayer):

  def __init__(self):
    super().__init__()
    self.album = [self.mixer.Sound(sound) for sound in sound_files]

  def play_track(self, num, loop=-1):
    if not self.on:
      return
    track = self.album[num]
    self.mixer.Sound.play(track)

  def stop_track(self):
    pass