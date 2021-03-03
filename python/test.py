from random import randint, choice
from threading import Thread
import time


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
difficulty = 0
count = 0
squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225]
cubes = [8, 27, 64, 125, 216, 343]

num = 0
is_square = True

if difficulty == 0:
    num = choice(squares[:10])
    is_square = True
elif difficulty == 1:
    num = choice(squares[5:])
    is_square = True
else:
    num = choice(cubes)
    is_square = False

# print(num, is_square)


class Test:
    def __init__(self):
        self.__a = 1

    @property
    def a(self):
        raise AttributeError

    @a.setter
    def a(self, val):
        self.__a = val


result = None


def background_calculation():
    # here goes some long calculation
    time.sleep(randint(1, 5))

    # when the calculation is done, the result is stored in a global variable
    global result
    result = 42


def main():
    thread = Thread(target=background_calculation)
    thread.start()
    print("waiting")

    # wait here for the result to be available before continuing
    thread.join()
    background_calculation()
    print("waiting")

    print('The result is', result)


# if __name__ == '__main__':
#     main()

print("\n \
Beautiful code is both ELEGANT and EFFICIENT\n \
  ELEGANT: concise, easy to rea, easy to understand, easy to maintain, easy to modify\n \
  EFFICIENT: minimal CPU operations, minimal memory/storage requirements\n\n")
