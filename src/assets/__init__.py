import os

FILEPATH = os.path.dirname(__file__)

music_files = [
    os.path.join(FILEPATH, "WAV/CaveAdventure.wav"),
    os.path.join(FILEPATH, "WAV/Intro.wav")
]

sound_files = [
    os.path.join(FILEPATH, "WAV/Damage.wav"),        # 0
    os.path.join(FILEPATH, "WAV/MonsterDeath.wav"),  # 1
    os.path.join(FILEPATH, "WAV/Correct.wav"),       # 2
    os.path.join(FILEPATH, "WAV/Incorrect.wav"),     # 3
    os.path.join(FILEPATH, "WAV/MonsterSpawn.wav"),  # 4
    os.path.join(FILEPATH, "WAV/MenuSound.wav"),     # 5
    os.path.join(FILEPATH, "WAV/MenuFail.wav"),      # 6
    os.path.join(FILEPATH, "WAV/RunAway.wav")        # 7
]
