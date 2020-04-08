from room import Room
from player import Player
import time

# Declare all the rooms

room = {
    'outside':  Room("Outside Cave Entrance",
                     "North of you, the cave mount beckons"),

    'foyer':    Room("Foyer", """Dim light filters in from the south. Dusty
passages run north and east."""),

    'overlook': Room("Grand Overlook", """A steep cliff appears before you, falling
into the darkness. Ahead to the north, a light flickers in
the distance, but there is no way across the chasm."""),

    'narrow':   Room("Narrow Passage", """The narrow passage bends here from west
to north. The smell of gold permeates the air."""),

    'treasure': Room("Treasure Chamber", """You've found the long-lost treasure
chamber! Sadly, it has already been completely emptied by
earlier adventurers. The only exit is to the south."""),
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
        # print all the things
        print("\n\nYou:")
        print(player)
        print("\n[n] North   [s] South   [e] East   [w] West       [q] Quit")
        user_in = input("")
        if user_in.lower() == 'q': break
        elif user_in.lower() == 'n': 
            if player.current.n_to:
                player.current = player.current.n_to
            else: print("\nThere is no room that way . . .")
        elif user_in.lower() == 's': 
            if player.current.s_to:
                player.current = player.current.s_to
            else: print("\nThere is no room that way . . .")
        elif user_in.lower() == 'e': 
            if player.current.e_to:
                player.current = player.current.e_to
            else: print("\nThere is no room that way . . .")
        elif user_in.lower() == 'w': 
            if player.current.w_to:
                player.current = player.current.w_to
            else: print("\nThere is no room that way . . .")
        else: print("Invalid input. Please try again . . .")
        time.sleep(1)


if __name__ == "__main__":
    main()
