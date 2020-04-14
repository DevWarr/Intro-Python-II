class Item:

    def __init__(self, name, description=None):
        self.name = name
        self.description = description if description else ""

    def full_description(self):
        return f"~C({self.name})~W:~e {self.description}"

    def __str__(self):
        return self.name
