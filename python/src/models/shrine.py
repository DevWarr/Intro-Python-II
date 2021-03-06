from .room import Room


class Shrine(Room):

  def __init__(self, name, description, inventory=None, guardian=None):
    super().__init__(name, description, inventory=inventory)
    self.__guardian = guardian
    if self.__guardian is not None:
      # If we initialize with a guardian,
      # let the guardian know that this is its shrine
      self.__guardian.shrine = self

  @property
  def guardian(self):
    return self.__guardian

  @guardian.setter
  def guardian(self, guardian):
    """
    Connects the guardian and Shrine together.
    Also used to set guardian attribute to None.
    """
    if guardian is not None:
      guardian.shrine = self
    self.__guardian = guardian
