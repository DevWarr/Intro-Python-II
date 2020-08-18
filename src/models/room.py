from .item import Item


class Room:

  def __init__(self, name, description, inventory=None):
    self.name = name
    self.description = description
    self.inv = inventory if inventory else []

  def remove_from_inv(self, name):
    """
    If possible, removes item from room.
    Casing does not matter.

    If the item is found, removes the item 
    from the inventory and returns the item.

    Else, returns None.
    """
    for item in self.inv:
      if item.name.lower() == name:
        self.inv.remove(item)
        return item
    return None

  def add_to_inv(self, item):
    """Adds item to room."""
    self.inv.append(item)


class DebugRoom(Room):
  def __init__(self):
    name = "|——————————————————————————————————————————————————————————————————————————————|"
    desc = "This adventure game requires a terminal 80 characters wide and 15 lines tall."
    inventory = [Item("Please resize"), Item(
        "So you can see"), Item("This text")]
    super().__init__(name, desc, inventory)
