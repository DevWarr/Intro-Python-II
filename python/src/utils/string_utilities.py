import re


def format_string_block(string_block, width, height):
  """
  Formats a string block to fit a specfic text width and height.

  Returns an array of strings where
  - len(array)    = height
  - len(array[i]) = width
  """

  # Turn the string block into an array of strings
  if isinstance(string_block, list):
    str_array = string_block
  else:
    str_array = string_block.split("\n")

  if len(str_array) < height:
    # If our array isn't as long as our height,
    # add in extra lines of space so it does
    [str_array.append(" " * width) for i in range(len(str_array), height)]
  elif len(str_array) > height:
    # If our array is longer than our height... crop it.
    str_array = str_array[:height]

  for i in range(0, len(str_array)):
    # Ensure that each line (not counting color codes)
    # is the desired width.
    line_length = len(re.sub(r"~\w", "", str_array[i]))
    if line_length < width:
      # Too short? Add extra space
      str_array[i] += " " * (width - line_length)
    elif line_length > width:
      # Too long? Sorry... crop it.
      str_array[i] = str_array[i][:width]

  return str_array


def is_white_substring(msg, i):
  """Checks if the string at the current index is `'{}'`"""
  return msg[i] == "{" and (i - 1 < 0 or (msg[i - 1] != "(" and msg[i - 1] != "W")) and (i + 1 < len(msg) and msg[i + 1] == "}")


def is_item_substring(msg, i):
  """Checks if the string at the current index is `'({})'`"""
  if msg[i] == "(" and i + 4 <= len(msg):
    return msg[i:i + 4] == "({})"
  else:
    return False
