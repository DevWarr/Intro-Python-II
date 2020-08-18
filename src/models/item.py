class Item:

  def __init__(self, name, description=None):
    self.name = name
    self.description = description if description else ""

  def __str__(self):
    return self.name
