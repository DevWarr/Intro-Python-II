from classes.room import Room
from classes.player import Player
from classes.item import Item
from utils.colors import color
from classes.game_map import Map
from utils.music import MusicPlayer, SoundPlayer
import random
import time
import os

#
# Main
#

# Make a new player object that is currently in the 'outside' room.

# Write a loop that:
#
# * Prints the current room name
# * Prints the current description (the textwrap module might be useful here).
# * Waits for user input and decides what to do.
#
# If the user enters a cardinal direction, attempt to move to the room there.
# Print an error message if the movement isn't allowed.
#
# If the user enters "q", quit the game.

music_player = MusicPlayer()
sound_player = SoundPlayer()


def is_direction(val):
    return val == 'n' or val == 's' or val == 'e' or val == 'w'


def print_and_wait(msg):
    print(msg)
    word_count = len(msg.split(" "))
    total_time = max(1, word_count/2.5 - 1)
    time.sleep(total_time)


def game(adv):
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

    def display_msg():
        """Display message to user"""
        os.system('cls||clear')
        print(adv.display_info(show_map))
        print(controls[display])

    def display_load(total_time=1, extra_text=""):
        """Displays a loading spinner underneath a message"""
        spinner = "\|/-"
        for i in range(0, total_time*10):
            display_msg()
            print(extra_text)
            print(color(f"~X{spinner[i % 4]}"))
            time.sleep(0.1)
        return

    while loop:
        traveling = False
        display_msg()
        user_in = input("").lower().strip().split(" ")

        # Quitting the Game
        if user_in[0] == 'q':
            music_player.stop_track()
            break
        # Toggle the map
        elif user_in[0] == 'm':
            sound_player.play_track(5)
            show_map = not show_map
        # Toggle controls
        elif user_in[0] == 'o':
            sound_player.play_track(5)
            display = not display
        # Moving through the map
        elif is_direction(user_in[0]):
            success = adv.move(user_in[0])
            if success:
                time.sleep(0.3)
                sound_player.play_track(5)
                traveling = True
            else:
                sound_player.play_track(6)
                print_and_wait(color("~RThere is no room that way . . ."))
        # Taking an item
        elif user_in[0] == 'take':
            if len(user_in) > 1:
                sound_player.play_track(5)
                print_and_wait(adv.take_item(" ".join(user_in[1:])))
            else:
                sound_player.play_track(6)
                print_and_wait(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to take."))
        # Dropping an item
        elif user_in[0] == 'drop':
            if len(user_in) > 1:
                sound_player.play_track(5)
                print_and_wait(adv.drop_item(" ".join(user_in[1:])))
            else:
                sound_player.play_track(6)
                print_and_wait(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to drop."))
        # Invalid input
        else:
            sound_player.play_track(6)
            print_and_wait(color("~RInvalid input. Please try again . . ."))
    exit()


def intro():
    music_player.play_track(1)

    def display_intro():
        """Display intro message to user"""
        os.system('cls||clear')
        print(color(
            "\n~WThis adventure game requires a terminal 80 characters wide and 15 lines tall. Yep."))
        print(
            "[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n")
        print("\n\nIf you can't see all of this text, please resize your terminal.")
        print(color(
            "Once you're good to go, ~Wtype a player name~e to begin. Or, type ~W[q]~e to quit."))

    player = None
    while True:
        display_intro()
        user_in = input("").strip()

        # No name? Reset the loop
        if len(user_in) == 0:
            continue
        # Name too long? Sorry bub.
        elif len(user_in) > 15:
            print(
                color("~RThat name is too long! Please have a name less than 15 characters."))
            time.sleep(1.1)
        # q -> quit
        elif user_in == 'q':
            music_player.stop_track()
            break
        # Valid input? Use it as the name
        else:
            player = Player(user_in, [Item("pill")])
            music_player.stop_track()
            sound_player.play_track(5)
            for i in range(0, 6):
                display_intro()
                print(color("~BStarting Game ." + " ."*(i % 3)))
                time.sleep(0.5)
            break
    # If the player entered a name, start. If not, exit.
    if player:
        adv = Map(player)
        game(adv)


if __name__ == "__main__":
    intro()
