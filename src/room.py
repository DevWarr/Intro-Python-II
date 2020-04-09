# Implement a class to hold room information. This should have name and
# description attributes.
from utils.colors import color


class Room:

    def __init__(self, name, description, inventory=None, connecting=None):
        self.name = name
        self.description = description
        self.connecting = connecting if connecting else [
            None, None, None, None]
        self.__inv = inventory if inventory else []

    @property
    def n_to(self):
        return self.connecting[0]

    @n_to.setter
    def n_to(self, room):
        self.connecting[0] = room

    @property
    def s_to(self):
        return self.connecting[1]

    @s_to.setter
    def s_to(self, room):
        self.connecting[1] = room

    @property
    def e_to(self):
        return self.connecting[2]

    @e_to.setter
    def e_to(self, room):
        self.connecting[2] = room

    @property
    def w_to(self):
        return self.connecting[3]

    @w_to.setter
    def w_to(self, room):
        self.connecting[3] = room

    def __getitem__(self, item):
        directions = {'n': self.n_to, 's': self.s_to,
                      'e': self.e_to, 'w': self.w_to}
        return directions.get(item, None)

    def show_inv(self):
        """Outputs all item names from the inventory as a string"""
        out = ""
        if len(self.__inv) == 0:
            out += color("~xempty")
        else:
            item_names = [item.name for item in self.__inv]
            out += ", ".join(item_names)
        return f"[ {out} ]"

    def __str__(self):
        return color(f"~W{self.name}\n~e~g{self.description}\n~eItems: {self.show_inv()}")
