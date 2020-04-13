from utils.colors import color
import re
from os import system


def format_string_block(string_block, width, height):
    """
    Formats a string block to fit a specfic text width and height.

    Returns an array of strings where
    - len(array)    = height
    - len(array[i]) = width
    """
    
    # Turn the string block into an array of strings
    str_array = string_block.strip().split("\n")
    if len(str_array) < height:
        # If our array isn't as long as our height,
        # add in extra lines of space so it does
        [str_array.append(" "*width) for i in range(len(str_array), height)]
    elif len(str_array) > height:
        # If our array is longer than our height... crop it.
        str_array = str_array[:height]

    for i in range(0, len(str_array)):
        # Ensure that each line (not counting color codes)
        # is the desired width.
        line_length = len(re.sub(r"~\w", "", str_array[i]))
        if line_length < width:
            # Too short? Add extra space
            str_array[i] += " " * (width-line_length)
        elif line_length > width:
            # Too long? Sorry... crop it.
            str_array[i] = str_array[i][:width]

    return str_array


def display_screen(img, info1, info2, text, controls):
    """
    Takes text blocks for different segments of the 
    terminal screen, and formats them all in the correct place.

    Blocks of space in the terminal (width 80 x height 14):
      ________________________________________________________________________________
     |[                    ][                    ][                                  ]
     |[                    ][                    ][                                  ]
     |[       Image        ][        Info1       ][             Info2                ]
     |[                    ][                    ][                                  ]
     |[____________________][____________________][__________________________________]
     | ______________________________________________________________________________
     |[                                                                              ]
     |[       Text   -   -   -   -   -   -   -   -   -   -                           ]
     |[______________________________________________________________________________]
     | ______________________________________________________________________________
     |[_____Controls_________________________________________________________________]
     |>> Input
     |  [  Response  ]
     |  [  Empty space for cursor to sit after response  ]

    All text must be passed in WITHOUT calling color()
    in order for this function to properly check the length of each strings block.
    """
    # properly format each block
    img = format_string_block(img, 22, 5)
    info1 = format_string_block(info1, 22, 5)
    info2 = format_string_block(info2, 36, 5)

    text = format_string_block(text, 80, 3)
    controls = format_string_block(controls, 80, 1)

    output = ""
    for i in range(0, 5):
        # Add our three code blocks together, one by one
        output += img[i] + info1[i] + info2[i] + "\n"

    ouput += "\n"
    for i in range(0, 3):
        # Add our lower text information
        output += text[i]

    # Add our controls
    output += "\n" + controls

    # Clear the screen, and then print our output with the color function
    system('cls||clear')
    print(color(output))

def print_and_wait(msg, sec_to_wait=None):
    """
    Prints a message, and waits a short while before continuing
    """
    print(color(msg))
    word_count = len(msg.split(" "))
    if sec_to_wait is None:
        sec_to_wait = max(1, word_count/2.5 - 1)
    time.sleep(sec_to_wait)


# not functional ?
def display_load(total_time=1, text=""):
        """Displays a loading spinner underneath a message"""
        spinner = "\|/-"
        for i in range(0, total_time*10):
            print(text)
            print(color(f"~X{spinner[i % 4]}"))
            time.sleep(0.1)
        return