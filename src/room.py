# Implement a class to hold room information. This should have name and
# description attributes.
from utils.colors import color
from item import Item


class Room:

    def __init__(self, sign, name, description, inventory=None):
        self.sign = sign
        self.name = name
        self.description = description
        self.inv = inventory if inventory else []

    def show_inv(self):
        """Outputs all item names from the inventory as a string"""
        out = ""
        if len(self.inv) == 0:
            out += color("~xempty")
        else:
            item_names = [str(item) for item in self.inv]
            out += ", ".join(item_names)
        return f"[ {out} ]"

    def remove_item(self, name):
        """
        If possible, removes item from room.
        Casing does not matter.
        """
        for item in self.inv:
            if item.name.lower() == name:
                self.inv.remove(item)
                return item
        return None

    def add_item(self, item):
        """Adds item to room"""
        if isinstance(item, Item):
            self.inv.append(item)

    def __str__(self):
        return color(f"~W{self.name}\n~e~g{self.description}\n~eItems: {self.show_inv()}")
