class Player:

  def __init__(self, name, inv=None):
    self.name = name
    self.__inv = inv if inv else []
    self.__max_inv = 4

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

  def add_inv(self, item):
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

  def get_item(self, name):
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

  def remove_item(self, name):
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

  def show_inv(self):
    """
    Outputs all item names from the inventory as a string.

    Formats items with 2 space indentation like so:
      Player's Inventory
        ( item1 )
        ( item2 )
        ( Big butter sword )

    If there are no items, returns "empty".
    """
    out = ""
    if len(self.__inv) == 0:
      out += "  ~xempty~e"
    else:
      # Creates an array with
      #   ↓↓ indent  spacing ↓↓
      # ["  ~c( item1 )~e", "  ~c( item2 )~e"]
      item_names = [f"  ~c( {str(item)} )~e" for item in self.__inv]
      out += "\n".join(item_names)
    return out

  def __str__(self):
    return f"~W{self.name}'s Inventory:~e\n{self.show_inv()}"
