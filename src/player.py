# Write a class to hold player information, e.g. what room they are in
# currently.
from utils.colors import color

class Player:

    def __init__(self, name, current, inv=None):
        self.name = name
        self.current = current
        self.__inv = inv if inv else []

    @property
    def inv(self): return [*self.__inv]

    @inv.setter
    def inv(self, array):
        if len(array) < 3:
            self.__inv = array
        else: print("Inventory too big.")

    def add_inv(self, item):
        if len(self.__inv) > 2:
            return "You have too many items!"
        else: self.__inv.append(item)

    def __str__(self):
        return color(f"~WName~e {self.name}\n~WInventory~e {self.inv}\n\n{self.current}")
