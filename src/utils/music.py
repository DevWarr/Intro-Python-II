from playsound import playsound
from assets.assets import main_track, intro_track


class Music:

    def __init__(self):
        self.main = main_track
        self.intro = intro_track

    def playintro(self):
        playsound(self.intro, False)

    def playmain(self):
        playsound(self.main, False)
