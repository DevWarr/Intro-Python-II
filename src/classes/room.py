from .item import Item


class Room:

  def __init__(self, name, description, inventory=None):
    self.name = name
    self.description = description
    self.inv = inventory if inventory else []

  def show_inv(self):
    """
    Outputs all item names from the inventory as a string, formatted like so:

        [ (item1), (item2), (Big butter sword) ]

    If inventory is empty, returns 
        [ empty ]
    """
    out = ""
    if len(self.inv) == 0:
      out += "~xempty~e"
    else:
      item_names = [f"~c({str(item)})~e" for item in self.inv]
      out += ", ".join(item_names)
    return f"[ {out} ]"

  def remove_item(self, name):
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

  def add_item(self, item):
    """Adds item to room."""
    self.inv.append(item)

  def __str__(self):
    return f"~W{self.name}\n~e~g{self.description}\n~eItems: {self.show_inv()}"

class DebugRoom(Room):
  def __init__(self):
    name = "|——————————————————————————————————————————————————————————————————————————————|"
    desc = "This adventure game requires a terminal 80 characters wide and 15 lines tall."
    inventory = [Item("Please resize"), Item("So you can see"), Item("This text")]
    super().__init__(name, desc, inventory)