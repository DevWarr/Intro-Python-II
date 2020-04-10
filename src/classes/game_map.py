from classes.room import Room
from classes.shrine import Shrine
from classes.item import Item
from utils.colors import color

# 0 -> Empty space
# 1 -> Tunnel
# 2 -> Multip
# 3 -> Divid
# 4 -> Square
# 5 -> multipl
# 6 -> Artifact
room_template = [
    ["Entrance", "Return here once you have the mathematical artifact. Use it to escape this maze!"],
    ["Tunnel", "Nothing extravagant. An Empty tunnel."],
    ["Multip Shrine", "The Shrine of the Multip sign, granting the power of multiplication.", [
        Item("Multip")]],
    ["Divid Shrine", "The Shrine of the Divid sign, granting the power of division.", [
        Item("Divid")]],
    ["Square Shrine", "The Shrine of the Square sign, granting the power of squaring.", [
        Item("Square")]],
    ["Root Shrine", "The Shrine of the Root sign, granting the power of square rooting.", [
        Item("Root")]],
    ["Artifact Shrine", "The Shrine of the Ancient Mathematical Artifact! Grab it, and get out of here!", [
        Item("Artifact")]]
]
room_sign = {
    "empty":    "   ",
    "tunnel":   "[ ]",
    "entrance": "[X]",
    "shrine":   "[S]",
    "artifact": "[A]"
}


class Map:

    def __init__(self, player):
        self.player = player
        self.position = [4, 1]  # [y, x]
        self.map = self.create_map()
        self.entrance = self.map[4][1]

    @property
    def x(self):
        return self.position[1]

    @property
    def y(self):
        return self.position[0]

    def create_map(self):
        """
        Creates a map like this:
        [S]      [ ][ ]
        [ ][ ][ ][ ][S]
        [ ]   [S]   [ ]
        [ ][S]      [ ]
        [ ][X]   [A][ ]
        """
        # 0 -> Empty space
        # 1 -> Tunnel
        # 2 -> Multip
        # 3 -> Divid
        # 4 -> Square
        # 5 -> Root
        # 6 -> Artifact
        # 7 -> Entrance
        empty_array = [
            [2, 0, 0, 1, 1],
            [1, 1, 4, 1, 3],
            [1, 0, 1, 0, 1],
            [1, 5, 0, 0, 1],
            [1, 7, 0, 6, 1]
        ]
        return [self.create_rooms(arr) for arr in empty_array]

    def create_rooms(self, room_arr):
        """Creates a room for each number value from the given array"""
        rooms = []
        for room_id in room_arr:
            if room_id == 0:
                # If id is 0, no room
                rooms.append(None)
            elif room_id == 7:
                # If id is 7, Entrance Room
                rooms.append(Room(*room_template[0]))
            elif room_id == 1:
                # If id is 1, Tunnel
                rooms.append(Room(*room_template[1]))
            else:
                # Use the values from the room_template to create a new room
                rooms.append(Shrine(*room_template[room_id]))
        print(rooms)
        return rooms

    def confirm_direction(self, y, x):
        """
        Confirms that our new direction is both
            -   in range
            -   A valid room
        This could be done all in one if statement,
        But the y, x, and valid room checks are
            separated for readability.
        """
        if 0 <= y and y < len(self.map):
            if 0 <= x and x < len(self.map[0]):
                if self.map[y][x] is not None:
                    return True
        return False

    def move(self, direction):
        """
        Confirming each direction and making sure we stay in bounds,
        Moves a direction.
        Returns true if we moved, and false otherwise
        """
        if direction == 'n' and self.confirm_direction(self.y-1, self.x):
            self.position[0] -= 1
            return True
        elif direction == 's' and self.confirm_direction(self.y+1, self.x):
            self.position[0] += 1
            return True
        elif direction == 'w' and self.confirm_direction(self.y, self.x-1):
            self.position[1] -= 1
            return True
        elif direction == 'e' and self.confirm_direction(self.y, self.x+1):
            self.position[1] += 1
            return True
        else:
            return False

    def get_room(self):
        """Returns the Room object the player is currently in"""
        return self.map[self.y][self.x]

    def take_item(self, name):
        """
        If possible, 
        Takes an item from the current room
        And adds to the player inventory
        """
        room = self.get_room()
        item = room.remove_item(name)
        # If no Item, print message that item doesn't exist
        if item == None:
            return color(f"~C({name})~R is not in the room.")
        else:
            # If we can't add the item to our inventory,
            #     (Inventory may be too large)
            # Then return the item to the room
            success = self.player.add_inv(item)
            if not success:
                room.add_item(item)
                return color("~RYour inventory is full.")
            else:
                return color(f"You took ~C({item.name})~e.")

    def drop_item(self, name):
        """
        If possible,
        Removes item from player inventory
        And adds to current room.
        """
        item = self.player.remove_item(name)
        if item is None:
            return color(f"~C({name})~R is not in your inventory.")
        else:
            room = self.get_room()
            room.add_item(item)
            return color(f"You dropped ~C({item.name})~e.")

    def display_map(self):
        """
        Displays Map.

        Sign shrines are bold, and the player position is yellow.
        """
        output = ""
        for room_arr in self.map:
            temp = ""
            for room in room_arr:
                room_str = ""
                # print(room.name)
                # First ifs to determine string
                if room is None:
                    room_str = room_sign["empty"]
                elif room.name[:8].lower() == "artifact":
                    room_str = room_sign["artifact"]
                elif isinstance(room, Shrine):
                    room_str = room_sign["shrine"]
                elif room == self.entrance:
                    room_str = room_sign["entrance"]
                else:
                    room_str = room_sign["tunnel"]

                # Second ifs to determine color
                if room == self.get_room():
                    # Player is in the room? Yellow
                    room_str = color(f"~Y{room_str}")
                elif isinstance(room, Shrine):
                    room_str = color(f"~W{room_str}")
                temp += room_str

            output += temp + "\n"
        return output

    def display_info(self, show_map=False):
        """Displays Player info and Room info"""
        if show_map:
            return self.display_map() + "\n" + str(self.get_room())
        else:
            return "\n" + str(self.player) + "\n\n\n\n" + str(self.get_room())
