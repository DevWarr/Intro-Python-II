# Implement a class to hold room information. This should have name and
# description attributes.
class Room:

    def __init__(self, name, description, connecting=None):
        self.name = name
        self.description = description
        self.connecting = connecting if connecting else [None, None, None, None]

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


    def __str__(self):
        return f"{self.name}\n{self.description}"