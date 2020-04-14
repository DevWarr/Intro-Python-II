ansi_table = {
    'x': '\u001b[30m',
    'r': '\u001b[31m',
    'g': '\u001b[32m',
    'y': '\u001b[33m',
    'b': '\u001b[34m',
    'p': '\u001b[35m',
    'c': '\u001b[36m',
    'w': '\u001b[37m',
    'X': '\u001b[30;1m',
    'R': '\u001b[31;1m',
    'G': '\u001b[32;1m',
    'Y': '\u001b[33;1m',
    'B': '\u001b[34;1m',
    'P': '\u001b[35;1m',
    'C': '\u001b[36;1m',
    'W': '\u001b[37;1m',
    'e': '\u001b[0m'
}

def color(msg):
    """
    Takes in a string with the proper formatting,
    and outputs a string with ANSI color codes.

    Example input: "No color ~rRed Color ~eReset"

    Backslashes currently will not escape tildes.
    """
    out = ""
    for i,v in enumerate(msg):
        # If we have a tilde,
        # the next letter is a color code.
        # Get that color code from our dict,
        # or return nothing if it cannot be found.
        if v == "~":
            color = msg[i+1]
            out +=  ansi_table.get(color, "")
        # If the letter comes directly after a tilde,
        # it is a color code. Skip it.
        elif msg[i-1] == "~": pass
        # Otherwise, add the letters to the output.
        else: out += v
    return out + ansi_table["e"]