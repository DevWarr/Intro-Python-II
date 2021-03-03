from .item import Item
from .shrine import Shrine


class Player:

  def __init__(self, name, game_map, inv=None):
    self.name = name
    self.game_map = game_map
    self.position = [4, 1]  # [y, x]
    self.prev = None
    self.__inv = inv if inv else []
    self.__max_inv = 4

  @property
  def x(self):
    return self.position[1]

  @property
  def y(self):
    return self.position[0]

  @property
  def current_room(self):
    """Returns the Room object the player is currently in"""
    return self.game_map.map[self.y][self.x]

  @property
  def inv(self): return [*self.__inv]

  @inv.setter
  def inv(self, array):
    """
    Sets the player's entire inventory.

    If the new inventory fits the max inventory 
    size, assigns the inventory and returns True.

    Else, returns False.
    """
    if len(array) <= self.__max_inv:
      self.__inv = array
      return True
    else:
      return False

  def add_to_inv(self, item):
    """
    Adds an item to the inventory.

    If the item would make the inventory too large,
    returns False.

    Else, adds item and returns True.
    """
    if len(self.__inv) >= self.__max_inv:
      return False
    else:
      self.__inv.append(item)
      return True

  def get_from_inv(self, name):
    """
    If possible, retrieves item from player inventory.
    Casing does not matter.

    If the item is found, returns the item.

    Else, returns None.
    """
    for item in self.__inv:
      if item.name.lower() == name:
        return item
    return None

  def remove_from_inv(self, name):
    """
    If possible, removes item from player inventory.
    Casing does not matter.

    If the item is found, removes the item 
    from the inventory and returns the item.

    Else, returns None.
    """
    for item in self.__inv:
      if item.name.lower() == name:
        self.__inv.remove(item)
        return item
    return None

  def take_item(self, name):
    """
    If possible, 
    Takes an item from the current room
    And adds to the player inventory
    """
    room = self.current_room
    item = room.remove_from_inv(name)
    # If no Item, print message that item doesn't exist
    if item == None:
      return (None, name)
    else:
      # If we can't add the item to our inventory,
      #     (Inventory may be too large)
      # Then return the item to the room
      success = self.add_to_inv(item)
      if not success:
        room.add_to_inv(item)
        return (False, item.name)
      else:
        return (True, item.name)

  def drop_item(self, name):
    """
    If possible,
    Removes item from player inventory
    And adds to current room.
    """
    item = self.remove_from_inv(name)
    if item is None:
      return (None, name)
    else:
      room = self.current_room
      room.add_to_inv(item)
      return (True, item.name)

  def use_item(self, name):
    """
    Uses an item in the Player's inventory.

    Only used to end the game.
    The item must be the Artifact,
    and the player must be in the Entrance Room.

    If:
    - Player doesn't have item → (None, name)
    - Above conditions are met → (True, item.name).
    - Else                     → (False, item.name).
    """
    item = self.get_from_inv(name)
    if item is None:
      return (None, name)
    if item.name == "Artifact" and [self.y, self.x] == [4, 1]:
      return (True, item.name)
    else:
      return (False, item.name)

  def confirm_direction(self, y, x):
    """
    Confirms that our new direction is both
        -   in range
        -   A valid room
    This could be done all in one if statement,
    But the y, x, and valid room checks are
        separated for readability.
    """
    if 0 <= y and y < len(self.game_map.map):
      if 0 <= x and x < len(self.game_map.map[0]):
        if self.game_map.map[y][x] is not None:
          return True
    return False

  def move(self, direction):
    """
    Confirming each direction and making sure we stay in bounds,
    moves a direction and stores previous location.

    Returns true if we moved, and false otherwise
    """
    if direction == 'n' and self.confirm_direction(self.y - 1, self.x):
      self.prev = [*self.position]
      self.position[0] -= 1
      return True
    elif direction == 's' and self.confirm_direction(self.y + 1, self.x):
      self.prev = [*self.position]
      self.position[0] += 1
      return True
    elif direction == 'w' and self.confirm_direction(self.y, self.x - 1):
      self.prev = [*self.position]
      self.position[1] -= 1
      return True
    elif direction == 'e' and self.confirm_direction(self.y, self.x + 1):
      self.prev = [*self.position]
      self.position[1] += 1
      return True
    else:
      return False

  def run_away(self):
    self.position = [*self.prev]

  def check_for_guardian(self):
    """
    Checks if a guardian is in the current room.

    If there is a guardian, returns the guardian.
    Else, returns None.
    """
    if isinstance(self.current_room, Shrine):
      return self.current_room.guardian


class GamePlayer(Player):

  def __init__(self, name, game_map):
    super().__init__(
        name, game_map, [Item("Calculator", "Simple Calculator. Can add and subtract.")])


class DebugPlayer(Player):

  def __init__(self, name):
    inventory = [
        Item("Calculator", "Simple Calculator. Can add and subtract."),
        Item("Artifact", "Simple Calculator. Can add and subtract.")
    ]
    super().__init__(name, None, inventory)
