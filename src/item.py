from utils.colors import color

class Item:

    def __init__(self, name, description=None):
        self.name = name
        self.description = description if description else ""

    def full_description(self):
        return color(f"~W{self.name}:~e\n{self.description}")

    def __str__(self):
        return color(self.name)
