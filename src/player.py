# Write a class to hold player information, e.g. what room they are in
# currently.
class Player:

    def __init__(self, name, current, inv=None):
        self.name = name
        self.current = current
        self.inv = inv if inv else []

    
    def __str__(self):
        return f"Name: {self.name}\nInventory: {self.inv}\n\n{self.current}"