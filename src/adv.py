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
        "You've found the long-lost treasure chamber! Sadly, it has already been completely emptied by earlier... Is that treasure?! The only exit is to the south.",
        [Item("treasure")]),
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

def main(player):
    loop = True
    while loop:
        # Print message to User
        os.system('cls||clear')
        print("You:")
        print(player)
        print(color(
            "\n~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest       ~W[q] ~eQuit"))
        user_in = input("").lower().strip()

        if user_in == 'q':
            break
        elif user_in == 'n' or 's' or 'e' or 'w':
            if player.current[user_in]:
                player.current = player.current[user_in]
            else:
                print("There is no room that way . . .")
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

        if len(user_in) == 0:
            continue
        elif len(user_in) > 15:
            print(color("~RThat name is too long! Please have a name less than 15 characters."))
            time.sleep(1.1)
        elif user_in == 'q':
            break
        else: 
            player = Player(user_in, room['outside'], [Item("pill")])
            print(color("~BStarting Game . . ."))
            time.sleep(1.7)
            break
    # If the player entered a name, start. If not, exit.
    main(player) if player else exit()
