import PyInstaller.__main__
import os


if __name__ == "__main__":
    FILEPATH = os.path.dirname(__file__)
    PyInstaller.__main__.run([
        "--name=Adventure",
        "--onefile",
        "--windowed",
        "--distpath=../dist",
        "--workpath=../build/adv",
        f"--add-data={os.path.join(FILEPATH, 'assets/WAV/')};assets/WAV",
        f"--add-data={os.path.join(FILEPATH, 'assets/GIF/')};assets/GIF",
        "adv.py"
    ])