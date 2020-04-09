# Write a class to hold player information, e.g. what room they are in
# currently.
from utils.colors import color


class Player:

    def __init__(self, name, current, inv=None):
        self.name = name
        self.current = current
        self.__inv = inv if inv else []

    @property
    def inv(self): return self.__inv

    @inv.setter
    def inv(self, array):
        if len(array) <= 5:
            self.__inv = array
        else:
            print("Inventory too big.")

    def add_inv(self, item):
        if len(self.__inv) >= 5:
            return False
        else:
            self.__inv.append(item)
            return True

    def show_inv(self):
        """Outputs all item names from the inventory as a string"""
        out = ""
        if len(self.__inv) == 0:
            out += color("~xempty")
        else:
            item_names = [item.name for item in self.__inv]
            out += ", ".join(item_names)
        return f"[ {out} ]"

    def take_item(self, name):
        """Takes an item from the current room if possible"""
        item = self.current.take_item(name)
        # If no Item, print message that item doesn't exist
        if item == None:
            return color(f"~C({name})~R is not in the room.")
        else:
            # If we can't add the item to our inventory,
            #     (Inventory may be too large)
            # Then return the item to the room
            success = self.add_inv(item)
            if not success:
                self.current.add_item(item)
                return color("~RYour inventory is full.")
            else:
                return color(f"You took ~C({item.name})~e.")

    def drop_item(self, name):
        for item in self.inv:
            if item.name == name:
                self.inv.remove(item)
                self.current.add_item(item)
                return color(f"You dropped ~C({item.name})~e.")
        return color(f"~C({name})~R is not in your inventory.")


    def __str__(self):
        return color(f"~WName~e {self.name}\n~WInventory~e {self.show_inv()}\n\n{self.current}")
