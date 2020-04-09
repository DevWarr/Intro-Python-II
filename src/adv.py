from room import Room
from player import Player
from item import Item
from utils.colors import color
import time
import os

# Declare all the rooms

room = {
    'outside':  Room(
        "Outside Cave Entrance",
        "North of you, the cave mount beckons",
        [Item("stick")]),
    'foyer':    Room(
        "Foyer",
        "Dim light filters in from the south. Dusty passages run north and east.",
        []),
    'overlook': Room(
        "Grand Overlook",
        "A steep cliff appears before you, falling into the darkness. Ahead to the north, a light flickers in the distance, but there is no way across the chasm.",
        [Item("staff")]),
    'narrow':   Room(
        "Narrow Passage",
        "The narrow passage bends here from west to north. The smell of gold permeates the air.",
        []),
    'treasure': Room(
        "Treasure Chamber",
        "You've found the long-lost treasure chamber! And... Is that treasure?! The only exit is to the south.",
        [Item("treasure"), Item("more treasure"), Item("even more treasure")]),
}


# Link rooms together

room['outside'].n_to = room['foyer']
room['foyer'].s_to = room['outside']
room['foyer'].n_to = room['overlook']
room['foyer'].e_to = room['narrow']
room['overlook'].s_to = room['foyer']
room['narrow'].w_to = room['foyer']
room['narrow'].n_to = room['treasure']
room['treasure'].s_to = room['narrow']

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


def main(player):
    loop = True
    controls = [
        color(
            "\n~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest   ~W[m] ~eMore controls       ~W[q] ~eQuit"),
        color(
            "\n~W[take ~e~c(item)~W]~e from room   ~W[drop ~e~c(item)~W]~e from inventory   ~W[back]~e previous controls")
    ]
    display = 0  # 0 -> simple  |  1 -> advanced
    while loop:
        # Print message to User
        os.system('cls||clear')
        print("You:")
        print(player)
        print(controls[display])
        user_in = input("").lower().strip().split(" ")

        # Quitting the Game
        if user_in[0] == 'q':
            break
        # Showing advanced controls
        elif user_in[0] == 'm':
            display = 1
        # Showing simple controls
        elif user_in[0] == 'back':
            display = 0
        # Moving through the map
        elif is_direction(user_in[0]):
            if player.current[user_in[0]]:
                player.current = player.current[user_in[0]]
            else:
                print("There is no room that way . . .")
        # Taking an item
        elif user_in[0] == 'take':
            if len(user_in) > 1:
                print(player.take_item(" ".join(user_in[1:])))
            else:
                print(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to take."))
        # Dropping an item
        elif user_in[0] == 'drop':
            if len(user_in) > 1:
                print(player.drop_item(" ".join(user_in[1:])))
            else:
                print(
                    color("~RPlease type the ~e~c(name)~R of the item you wish to drop."))
        # Invalid input
        else:
            print("Invalid input. Please try again . . .")
        time.sleep(1)


if __name__ == "__main__":
    player = None
    while True:
        # Message to User
        os.system('cls||clear')
        print(color(
            "\n~WThis adventure game requires a terminal 80 characters wide and 13 lines tall."))
        print("[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n")
        print("If you can't see all of this text, please resize your terminal.")
        print(color(
            "Once you're good to go, ~Wtype a player name~e to begin. Or, type ~W[q]~e to quit."))
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
            player = Player(user_in, room['outside'], [Item("pill")])
            print(color("~BStarting Game . . ."))
            time.sleep(1.7)
            break
    # If the player entered a name, start. If not, exit.
    main(player) if player else exit()
