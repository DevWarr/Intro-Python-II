from random import randint, choice


class CanAdd:
  """Mixin to allow addition"""

  def addition(self, difficulty=0):
    """
    Creates an addition question.

    returns an array → [question, answer]
    """
    num1 = 0
    num2 = 0
    if difficulty == 0:
      num1 = randint(0, 20)
      num2 = randint(0, 20)
    elif difficulty == 1:
      num1 = randint(9, 50)
      num2 = randint(9, 50)
    else:
      num1 = randint(15, 100)
      num2 = randint(15, 100)
    answer = num1 + num2
    question = f"What is {num1} plus {num2} ?"
    return [question, answer]


class CanSubtract:
  """Mixin to allow subtraction"""

  def subtraction(self, difficulty=0):
    """
    Creates a subtraction question.

    returns an array → [question, answer]
    """
    num1 = 0
    num2 = 0
    while True:
      if difficulty == 0:
        num1 = randint(0, 20)
        num2 = randint(0, 20)
      elif difficulty == 1:
        num1 = randint(9, 50)
        num2 = randint(9, 50)
      else:
        num1 = randint(15, 100)
        num2 = randint(15, 100)

      if not num1 - num2 < 0:
        break
    answer = num1 - num2
    question = f"What is {num1} minus {num2} ?"
    return [question, answer]


class CanDivide:
  """Mixin to allow divison"""

  def division(self, difficulty=0):
    """
    Creates a division question.

    returns an array → [question, answer]
    """
    num1 = 0
    num2 = 0
    while True:
      if difficulty == 0:
        num1 = randint(6, 20)
        num2 = randint(2, int(num1 / 2))
      elif difficulty == 1:
        num1 = randint(15, 50)
        num2 = randint(2, int(num1 / 2))
      else:
        num1 = randint(20, 100)
        num2 = randint(2, int(num1 / 2))

      if num1 % num2 == 0:
        break
    answer = num1 // num2
    question = f"What is {num1} divided by {num2} ?"
    return [question, answer]


class CanMultiply:
  """Mixin to allow multiplication"""

  def multiplication(self, difficulty=0):
    """
    Creates a multiplication question.

    returns an array → [question, answer]
    """
    num1 = 0
    num2 = 0
    if difficulty == 0:
      num1 = randint(3, 9)
      num2 = randint(3, 9)
    elif difficulty == 1:
      num1 = randint(3, 14)
      num2 = randint(3, 14)
    else:
      num1 = randint(4, 20)
      num2 = randint(4, 20)
    answer = num1 * num2
    question = f"What is {num1} times {num2} ?"
    return [question, answer]


class CanSquare:
  """Mixin to allow exponential multiplication"""

  def square(self, difficulty=0):
    """
    Creates an exponent question.

    returns an array → [question, answer]
    """
    num1 = 0
    num2 = 0
    if difficulty == 0:
      num1 = randint(2, 5)
      num2 = 2
    elif difficulty == 1:
      num1 = randint(2, 10)
      num2 = 2
    else:
      num1 = randint(2, 13)
      num2 = randint(2, 3)

    if num2 == 2:
      second_half = "squared"
    else:
      second_half = "cubed"
    question = f"What is {num1} {second_half} ?"
    answer = num1 ** num2
    return [question, answer]


class CanRoot:
  """Mixin to allow radical division"""

  def __perfect_cube(self, num):
    cube_root = num ** (1 / 3)
    return int(cube_root+0.1)

  def root(self, difficulty=0):
    """
    Creates a radical division question.

    returns an array → [question, answer]
    """
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

    if is_square:
      root = "square"
      answer = int(num ** (1 / 2))
    else:
      root = "cube"
      answer = self.__perfect_cube(num)
    question = f"What is the {root} root of {num} ?"
    return [question, answer]


if __name__ == "__main__":
  r = CanRoot()
  print(r.root(3))