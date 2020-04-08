from room import Room
from player import Player
import time
import os

# Declare all the rooms

room = {
    'outside':  Room("Outside Cave Entrance",
                     "North of you, the cave mount beckons"),

    'foyer':    Room("Foyer", "Dim light filters in from the south. Dusty passages run north and east."),

    'overlook': Room("Grand Overlook", "A steep cliff appears before you, falling into the darkness. Ahead to the north, a light flickers in the distance, but there is no way across the chasm."),

    'narrow':   Room("Narrow Passage", "The narrow passage bends here from west to north. The smell of gold permeates the air."),

    'treasure': Room("Treasure Chamber", "You've found the long-lost treasure chamber! Sadly, it has already been completely emptied by earlier adventurers. The only exit is to the south."),
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
player = Player("name", room['outside'])
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


def main():
    loop = True
    while loop:
        # Clear the terminal
        os.system('cls||clear')
        # print all the things
        print("\nYou:")
        print(player)
        print("\n[n] North   [s] South   [e] East   [w] West       [q] Quit")
        user_in = input("").lower()

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
    while True:
        os.system('cls||clear')
        print("\nThis adventure game requires a terminal 80 characters wide and 11 lines tall.")
        print("[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ][ ]\n")
        print("If you can't see all of this text, please resize your terminal.")
        print(
            "Once you're good to go, type [news] to begin. Or, type [q] to quit.")
        user_in = input("").lower()

        if user_in == 'q':
            exit()
        elif user_in == 'news':
            break
    main()
