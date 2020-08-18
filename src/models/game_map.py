from .room import Room
from .shrine import Shrine
from .item import Item
from .guardians import *


# 0 -> Empty space
# 1 -> Tunnel
# 2 -> Multip
# 3 -> Divid
# 4 -> Square
# 5 -> Radical
# 6 -> Artifact
room_template = [
    ["Entrance", "Return here with the mathematical artifact. Use it to escape this maze!"],
    ["Tunnel", "Nothing extravagant. An Empty tunnel."],
    ["Multip Shrine", "The Shrine of the Multip sign, granting the power of multiplication.", [
        Item("Multip")], MultipGuardian()],
    ["Divid Shrine", "The Shrine of the Divid sign, granting the power of division.", [
        Item("Divid")], DividGuardian()],
    ["Square Shrine", "The Shrine of the Square sign, granting the power of squaring.", [
        Item("Square")], SquareGuardian()],
    ["Radical Shrine", "The Shrine of the Radical sign, granting the power of square and cube rooting.", [
        Item("Radical")], RadicalGuardian()],
    ["Artifact Shrine", "The Shrine of the Ancient Mathematical Artifact! Grab it, and get out of here!", [
        Item("Artifact")], ArtifactGuardian()]
]
room_sign = {
    "empty": "   ",
    "tunnel": "[ ]",
    "entrance": "[X]",
    "shrine": "[S]",
    "artifact": "[A]"
}


class GameMap:

  def __init__(self):
    self.map = self.create_map()
    self.entrance = self.map[4][1]

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
    # 5 -> Radical
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
    return rooms

  def display_map(self):
    """
    Displays Game Map.

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
        elif room.name[:8] == "Artifact":
          room_str = room_sign["artifact"]
        elif isinstance(room, Shrine):
          room_str = room_sign["shrine"]
        elif room == self.entrance:
          room_str = room_sign["entrance"]
        else:
          room_str = room_sign["tunnel"]

        # Second ifs to determine color
        if room == [4, 1]:
          # Player is in the room? Yellow
          room_str = f"~Y{room_str}~e"
        elif room is not None and len(room.inv) > 0:
          # Room has any items in it? White
          room_str = f"~W{room_str}~e"
        temp += room_str

      output += temp + "\n"
    return output

  def display_info(self):
    """
    Displays Player info and Room info,
    formatted for the utils.display_screen function.

    Returns an array containing:
    - The map
    - An empty string (No 'Info1' section)
    - Player information
    - Room information
    """
    return [
        self.display_map(),
        None,
        self.player,
        self.get_room()
    ]
