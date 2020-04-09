from room import Room
from player import Player
from item import Item
from utils.colors import color
from game_map import Map
from utils.music import Music
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


def is_direction(val):
    return val == 'n' or val == 's' or val == 'e' or val == 'w'


def game(adv):
    loop = True
    controls = [
        color(
            "\n~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest   ~Y[m] ~eMap   ~Y[o] ~eOptions     ~R[q] ~eQuit"),
        color(
            "\n~W[take ~e~c(item)~W]~e from room   ~W[drop ~e~c(item)~W]~e from inventory   ~Y[o]~e previous controls")
    ]
    display = False  # False -> simple  |  True -> advanced
    show_map = False

    def display_msg(map_or_no):
        """Display message to user"""
        os.system('cls||clear')
        print(adv.display_info(map_or_no))
        print(controls[display])

    def display_load(total_time, extra_text=""):
        """Displays a loading spinner underneath a message"""
        spinner = "\|/-"
        for i in range(0, total_time*10):
            display_msg()
            print(extra_text)
            print(color(f"~X{spinner[i % 4]}"))
            time.sleep(0.1)

    while loop:
        traveling = False
        display_msg(show_map)
        user_in = input("").lower().strip().split(" ")

        # Quitting the Game
        if user_in[0] == 'q':
            break
        # Toggle the map
        elif user_in[0] == 'm':
            show_map = not show_map
        # Toggle controls
        elif user_in[0] == 'o':
            display = not display
        # Moving through the map
        elif is_direction(user_in[0]):
            success = adv.move(user_in[0])
            if success:
                traveling = True
            else:
                print(color("~RThere is no room that way . . ."))
        # Taking an item
        elif user_in[0] == 'take':
            if len(user_in) > 1:
                print(adv.take_item(" ".join(user_in[1:])))
            else:
                print(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to take."))
        # Dropping an item
        elif user_in[0] == 'drop':
            if len(user_in) > 1:
                print(adv.drop_item(" ".join(user_in[1:])))
            else:
                print(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to drop."))
        # Invalid input
        else:
            print("Invalid input. Please try again . . .")
        time.sleep(1)


def main():
    def display_intro():
        """Display intro message to user"""
        os.system('cls||clear')
        print(color(
            "\n~WThis adventure game requires a terminal 80 characters wide and 15 lines tall. Yep."))
        print("[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n")
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
            break
        # Valid input? Use it as the name
        else:
            player = Player(user_in, [Item("pill")])

            for i in range(0, 6):
                display_intro()
                print(color("~BStarting Game ." + " ."*(i % 3)))
                time.sleep(0.5)
            break
    # If the player entered a name, start. If not, exit.
    if player:
        adv = Map(player)
        Music().playmain()
        game(adv)


if __name__ == "__main__":
    main()
