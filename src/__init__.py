import PyInstaller.__main__
import os
import platform


if __name__ == "__main__":
    FILEPATH = os.path.dirname(__file__)
    separator = ";" if platform.system() == "Windows" else ":"

    PyInstaller.__main__.run([
        "--name=Adventure",
        "--onefile",
        "--windowed",
        "--distpath=../dist",
        "--workpath=../build/adv",
        f"--add-data={os.path.join(FILEPATH, 'assets/WAV/')}{separator}assets/WAV",
        f"--add-data={os.path.join(FILEPATH, 'assets/GIF/')}{separator}assets/GIF",
        "adv.py"
    ])