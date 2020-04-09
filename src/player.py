# Write a class to hold player information, e.g. what room they are in
# currently.
from utils.colors import color


class Player:

    def __init__(self, name, inv=None):
        self.name = name
        self.__inv = inv if inv else []

    @property
    def inv(self): return [*self.__inv]

    @inv.setter
    def inv(self, array):
        if len(array) <= 5:
            self.__inv = array
        else:
            print("Inventory too big.")

    def add_inv(self, item):
        """If possible, Adds an item to the inventory"""
        if len(self.__inv) >= 5:
            return False
        else:
            self.__inv.append(item)
            return True

    def remove_item(self, name):
        """
        If possible, removes item from player inventory.
        Casing does not matter.
        """
        for item in self.inv:
            if item.name.lower() == name:
                self.inv.remove(item)
                return item
        return None

    def show_inv(self):
        """Outputs all item names from the inventory as a string"""
        out = ""
        if len(self.__inv) == 0:
            out += color("~xempty")
        else:
            item_names = [str(item) for item in self.__inv]
            out += ", ".join(item_names)
        return f"[ {out} ]"

    def __str__(self):
        return color(f"~WName~e {self.name}\n~WInventory~e {self.show_inv()}")
