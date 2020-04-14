from classes.room import Room
from classes.player import Player
from classes.item import Item
from utils.colors import color
from classes.game_map import Map
from utils.music import MusicPlayer, SoundPlayer
import random
import time
import os
from sys import exc_info

music_player = MusicPlayer()
sound_player = SoundPlayer()


def is_direction(val):
    """Returns true if a cardinal direction"""
    return val == 'n' or val == 's' or val == 'e' or val == 'w'


def print_and_wait(msg, wait=None):
    """Prints a message, and waits a short while before continuing"""
    print(msg)
    word_count = len(msg.split(" "))
    if wait is None:
        wait = max(1, word_count/2.5 - 1)
    time.sleep(wait)


def display_screen(all_text):
    """Clears the screen and prints the all_text passed in."""
    os.system('cls||clear')
    print(all_text)


def battle(battle):
    pass


def game(adv):
    """Main Loop for the adventure game"""
    music_player.play_track()
    loop = True
    controls = [
        color(
            "\n~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest   ~Y[m] ~eMap   ~Y[o] ~eOptions     ~R[q] ~eQuit"),
        color(
            "\n~W[take ~e~c(item)~W]~e from room   ~W[drop ~e~c(item)~W]~e from inventory   ~Y[o]~e previous controls")
    ]
    display = False  # False -> simple  |  True -> advanced
    show_map = False

    def display_load(total_time=1, text=""):
        """Displays a loading spinner underneath a message"""
        spinner = "\|/-"
        for i in range(0, total_time*10):
            print(text)
            print(color(f"~X{spinner[i % 4]}"))
            time.sleep(0.1)
        return

    while loop:
        display_screen(adv.display_info(show_map) + "\n" + controls[display])
        user_in = input("").lower().strip().split(" ")

        if user_in[0] == 'q':
            # Quitting the Game
            music_player.stop_track()
            break
        elif user_in[0] == 'm':
            # Toggle the map
            sound_player.play_track(5)
            show_map = not show_map
        elif user_in[0] == 'o':
            # Toggle controls
            sound_player.play_track(5)
            display = not display
        elif is_direction(user_in[0]):
            # Moving through the map
            success = adv.move(user_in[0])
            if success:
                time.sleep(0.3)
                sound_player.play_track(5)
            else:
                sound_player.play_track(6)
                print_and_wait(color("~RThere is no room that way . . ."), 1)
        elif user_in[0] == 'take':
            # Taking an item
            if len(user_in) > 1:
                sound_player.play_track(5)
                print_and_wait(adv.take_item(" ".join(user_in[1:])))
            else:
                sound_player.play_track(6)
                print_and_wait(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to take."))
        elif user_in[0] == 'drop':
            # Dropping an item
            if len(user_in) > 1:
                sound_player.play_track(5)
                print_and_wait(adv.drop_item(" ".join(user_in[1:])))
            else:
                sound_player.play_track(6)
                print_and_wait(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to drop."))
        else:
            # Invalid input
            sound_player.play_track(6)
            print_and_wait(color("~RInvalid input. Please try again . . ."), 1)
    exit()


def intro():
    """Intro before Game starts"""
    music_player.play_track(1)

    intro_text = color("\n~WThis adventure game requires a terminal 80 characters wide and 15 lines tall. Yep.~e" + "\n" +
                       "[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n" + "\n" +
                       "\n\nIf you can't see all of this text, please resize your terminal." + "\n" +
                       "Once you're good to go, ~Wtype a player name~e to begin. Or, type ~W[q]~e to quit.")

    player = None
    while True:

        # Display the intro and wait for input
        display_screen(intro_text)
        user_in = input("").strip()

        if len(user_in) == 0:
            # No name? Reset the loop
            continue
        elif len(user_in) > 15:
            # Name too long? Sorry bub.
            print(
                color("~RThat name is too long! Please have a name less than 15 characters."))
            time.sleep(1.1)
        elif user_in == 'q':
            # q -> quit
            music_player.stop_track()
            break
        else:
            # Valid input? Use it as the name
            player = Player(user_in, [Item("pill")])
            music_player.stop_track()
            sound_player.play_track(5)
            for i in range(0, 6):
                display_screen(intro_text)
                print(color("~BStarting Game ." + " ."*(i % 3)))
                time.sleep(0.5)
            break
    if player:
        # If the player entered a name, start. If not, exit.
        adv = Map(player)
        game(adv)


if __name__ == "__main__":

    # Wrap everything in a try/except, so if an error is thrown
    #     we stop our players and exit peacefully
    try:
        intro()
    except Exception as e:
        music_player.stop_track()
        sound_player.stop_track()
        raise e
