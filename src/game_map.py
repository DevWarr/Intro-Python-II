from room import Room
from item import Item
from utils.colors import color

# 0 -> Empty space
# 1 -> Tunnel
# 2 -> plus
# 3 -> minus
# 4 -> divide
# 5 -> multiply
# 6 -> Artifact
room_template = [
    [],
    [1, "Tunnel", "Nothing extravagant. An Empty tunnel."],
    [2, "Plus Shrine", "The Shrine of the plus sign, granting the power of addition.", [
        Item("Plus")]],
    [3, "Minus Shrine", "The Shrine of the minus sign, granting the power of subtraction.", [
        Item("Minus")]],
    [4, "Divide Shrine", "The Shrine of the divide sign, granting the power of division.", [
        Item("Divide")]],
    [5, "Multip Shrine", "The Shrine of the multip sign, granting the power of multiplication.", [
        Item("Multip")]],
    [6, "Artifact Room", "The Shrine of the Ancient Mathematical Artifact! Grab it, and get out of here!", [
        Item("Artifact")]]
]
room_sign = [
    "   ",
    "[ ]",
    color("~W[+]"),
    color("~W[-]"),
    color("~W[/]"),
    color("~W[*]"),
    color("~W[A]")
]

class Map:

    def __init__(self, player):
        self.player = player
        self.position = [4, 1]  # [y, x]
        self.map = self.create_map()

    @property
    def x(self):
        return self.position[1]

    @property
    def y(self):
        return self.position[0]

    def create_map(self):
        """
        Creates a map like this:
        [+]      [ ][ ]
        [ ][ ][ ][ ][-]
        [ ]   [*]   [ ]
        [ ][/]      [ ]
        [ ][ ]   [A][ ]
        """
        # 0 -> Empty space
        # 1 -> Tunnel
        # 2 -> plus
        # 3 -> minus
        # 4 -> divide
        # 5 -> multiply
        # 6 -> Artifact
        empty_array = [
            [2, 0, 0, 1, 1],
            [1, 1, 5, 1, 3],
            [1, 0, 1, 0, 1],
            [1, 4, 0, 0, 1],
            [1, 1, 0, 6, 1]
        ]
        return [self.create_rooms(arr) for arr in empty_array]

    def create_rooms(self, room_arr):
        """Creates a room for each number value from the given array"""
        rooms = []
        for room_id in room_arr:
            # If id is 0, no room
            if room_id == 0:
                rooms.append(None)
            else:
                # Use the values from the room_template to create a new room
                rooms.append(Room(*room_template[room_id]))
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
            room.add_inv(item)
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
                if room is None:
                    # None -> empty space
                    temp += room_sign[0]
                elif room == self.get_room():
                    # Player is in the room? Yellow
                    temp += color(f"~Y{room_sign[room.sign]}")
                elif room.sign > 1:
                    # Sign shrine? Bold
                    temp += color(f"~W{room_sign[room.sign]}")
                else:
                    temp += room_sign[room.sign]
            output += temp +"\n"
        return output

    def display_info(self, show_map=False):
        """Displays Player info and Room info"""
        if show_map:
            return self.display_map() + "\n" + str(self.get_room())
        else:
            return "\n" + str(self.player) + "\n\n\n\n" + str(self.get_room())
