class Test:

    def __init__(self):
        self.__list = [None, None, None, None]
        #              ↑n    ↑s    ↑e    ↑w


    # Property = the getter for an attribute
    @property
    def list(self):
        return self.__list
    # ↑ list has no setter, so you cannot change the list directly

    @property
    def n_to(self):
        return self.__list[0]
        
    # Setter = the setter for an attribute
    @n_to.setter
    def n_to(self, name):
        self.__list[0] = name


    @property
    def s_to(self):
        return self.__list[1]

    @n_to.setter
    def s_to(self, name):
        self.__list[1] = name



# t = Test()
# print(t.list) # → [None, None, None, None]
# t.n_to = "new"
# print(t.list) # → ["new", None, None, None]
# print(t.n_to) # → "new"