import os

FILEPATH = os.path.dirname(__file__)

music_files = [
    os.path.join(FILEPATH, "CaveAdventure.wav"),
    os.path.join(FILEPATH, "Intro.wav")
]

sound_files = [
    os.path.join(FILEPATH, "Damage.wav"),        # 0
    os.path.join(FILEPATH, "MonsterDeath.wav"),  # 1
    os.path.join(FILEPATH, "MonsterSpawn.wav"),  # 2
    os.path.join(FILEPATH, "Correct.wav"),       # 3
    os.path.join(FILEPATH, "Incorrect.wav"),     # 4
    os.path.join(FILEPATH, "MenuSound.wav"),     # 5
    os.path.join(FILEPATH, "MenuFail.wav")      # 6
]
