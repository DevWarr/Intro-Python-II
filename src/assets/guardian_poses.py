from utils.colors import color

# Rarer Symbols:
# ‾
# √


def divid_guardian():
    """
    Prints out an ASCII version of the 
    Divid Guardian. \n
     (/)  -//-  8)  \n
      Y___|##|__9]  \n
      8===]//[==97  \n
      I‾‾‾|][|‾‾    \n
      I __J/\\\__   \n
       \n
      Y   -//-  8)  \n
      8‾=_|##|__9]  \n
      I‾-=]//[==97  \n
      I   |][|‾‾    \n
        __J/\\\__   \n
    """
    stand = color("~C(~B/~C)~e  -~B//~e-  8)  \n")
    stand += color(" ~WY~e___|~r##~e|__9]  \n")
    stand += color(" ~W8~e===]~B//~e[==97  \n")
    stand += color(" ~WI~e‾‾‾|]~x[~e|‾‾    \n")
    stand += color(" ~WI~e _~W_~e~wJ/~x\\~e\~W_~e_   \n")

    correct = color(" ~WY~e   -~B//~e-  8)  \n")
    correct += color(" ~W8~e‾=_|~r##~e|__9]  \n")
    correct += color(" ~WI~e‾-=]~B//~e[==97  \n")
    correct += color(" ~WI~e   |]~x[~e|‾‾    \n")
    correct += color("   _~W_~e~wJ/~x\\~e\~W_~e_   \n")

    incorrect = color(" ~RY~e   -~B//~e-  8)  \n")
    incorrect += color(" ~R8~e‾=_|~r##~e|__9]  \n")
    incorrect += color(" ~WI~e‾-=]~B//~e[==97  \n")
    incorrect += color(" ~WI~e   |]~x[~e|‾‾    \n")
    incorrect += color("   _~W_~e~wJ/~x\\~e\~W_~e_   \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}


def multip_guardian():
    """
    Prints out an ASCII version of the 
    Multip Guardian. \n
     (*)  +**+      \n
      Y___|##|==9]  \n
      8===]**[‾‾97  \n
      I   |][|      \n
      I   [][L      \n
      \n
      Y   +**+      \n
      8‾=_|##|==9]  \n
      I‾-=]**[‾‾97  \n
      I   |][|      \n
          [][L      \n
    """
    stand = color("~C(~B*~C)~e  +~B**~e+      \n")
    stand += color(" ~WY~e___|~r##~e|==9\  \n")
    stand += color(" ~W8~e===]~B**~e[‾‾97  \n")
    stand += color(" ~WI~e   |][|      \n")
    stand += color(" ~WI~e   ~w[]~x[L      \n")

    correct = color(" ~WY~e   +~B**~e+      \n")
    correct += color(" ~W8~e‾=_|~r##~e|==9\  \n")
    correct += color(" ~WI~e‾-=]~B**~e[‾‾97  \n")
    correct += color(" ~WI~e   |][|      \n")
    correct += color("     ~w[]~x[L      \n")

    incorrect = color(" ~RY~e   +~B**~e+      \n")
    incorrect += color(" ~R8~e‾=_|~r##~e|==9\  \n")
    incorrect += color(" ~WI~e‾-=]~B**~e[‾‾97  \n")
    incorrect += color(" ~WI~e   |][|      \n")
    incorrect += color("     ~w[]~x[L      \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}


def square_guardian():
    """
    Prints out an ASCII version of the 
    Square Guardian. \n
     (^)  *^^*  +*  \n
      Y___|##|__()  \n
      8===]^^[==97  \n
      I   |][|      \n
      I   [][]      \n
      \n
      Y   *^^*  +*  \n
      8‾=_|##|__()  \n
      I‾-=]^^[==97  \n
      I   |][|      \n
          [][]      \n
    """
    stand = color("~C(~B^~C)~e  *~B^^~e*  ~W+*  \n")
    stand += color(" ~WY~e___|~r##~e|__()  \n")
    stand += color(" ~W8~e===]~B^^~e[==9~x7  \n")
    stand += color(" ~WI~e   |][|      \n")
    stand += color(" ~WI~e   ~w[]~x[]      \n")

    correct = color(" ~WY~e   *~B^^~e*  ~W+*  \n")
    correct += color(" ~W8~e‾=_|~r##~e|__()  \n")
    correct += color(" ~WI~e‾-=]~B^^~e[==9~x7  \n")
    correct += color(" ~WI~e   |][|      \n")
    correct += color("     ~w[]~x[]      \n")

    incorrect = color(" ~RY~e   *~B^^~e*  ~W+*  \n")
    incorrect += color(" ~R8~e‾=_|~r##~e|__()  \n")
    incorrect += color(" ~WI~e‾-=]~B^^~e[==9~x7  \n")
    incorrect += color(" ~WI~e   |][|      \n")
    incorrect += color("     ~w[]~x[]      \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}


def radical_guardian():
    """
    Prints out an ASCII version of the 
    Root Guardian. \n
     (√)  ^√√^      \n
      Y___|##|==()  \n
      8===]//[‾‾97  \n
      I   |][|  ^^  \n
      I   ^^^^      \n
      \n
      Y   ^√√^      \n
      8‾=_|##|==()  \n
      I‾-=]//[‾‾97  \n
      I   |][|  ^^  \n
          ^^^^      \n
    """
    stand = color("~C(~B√~C)~e  ^~B√√~e^      \n")
    stand += color(" ~WY~e___|~r##~e|==()  \n")
    stand += color(" ~W8~e===]//[‾‾97  \n")
    stand += color(" ~WI~e   |][|  ^^  \n")
    stand += color(" ~WI~e   ~y^^^^      \n")

    correct = color(" ~WY~e   ^~B√√~e^      \n")
    correct += color(" ~W8~e‾=_|~r##~e|==()  \n")
    correct += color(" ~WI~e‾-=]//[‾‾97  \n")
    correct += color(" ~WI~e   |][|  ^^  \n")
    correct += color("     ~y^^^^      \n")

    incorrect = color(" ~RY~e   ^~B√√~e^      \n")
    incorrect += color(" ~R8~e‾=_|~r##~e|==()  \n")
    incorrect += color(" ~WI~e‾-=]//[‾‾97  \n")
    incorrect += color(" ~WI~e   |][|  ^^  \n")
    incorrect += color("     ~y^^^^      \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}


def artifact_guardian():
    """
    Prints out an ASCII version of the 
    Artifact Guardian. \n
      +A* *//*      \n
      (8__|##|==9\  \n
      (q==]--[‾‾97  \n
          |][|  ^^  \n
          ^^^^      \n
          \n
          *//*      \n
      +A*_|##|==9\  \n
      (R==]--[‾‾97  \n
          |][|  ^^  \n
          ^^^^      \n
          \n
      (8  *//*      \n
       \=\|##|==9\  \n
        `‾]--[‾‾97  \n
          |][|  ^^  \n
          ^^^^      \n
    """
    stand = color(" ~C*~BA~C+~e *~B//~e*      \n")
    stand += color(" ~W(8~X__~W|~e~r##~W|~X--~W9~e\  \n")
    stand += color(" ~W(q~X==~W]~BAA~W[~X‾‾~W97  \n")
    stand += color("     ~W|]~X[|  ~Y^^  \n")
    stand += color("     ~Y^^^^      \n")

    correct = color(" ~W(8~e  *~B//~e*      \n")
    correct += color("  ~W\=~X\~W|~e~r##~W|~X--~W9~e\  \n")
    correct += color("   ~X`‾~W]~BAA~W[~X‾‾~W97  \n")
    correct += color("     ~W|]~X[|  ~Y^^  \n")
    correct += color("     ~Y^^^^      \n")

    incorrect = color("     *~B//~e*      \n")
    incorrect += color(" ~R*A+~e_~W|~e~r##~W|~X--~W9~e\  \n")
    incorrect += color("  ~WR~X==~W]~BAA~W[~X‾‾~W97  \n")
    incorrect += color("     ~W|]~X[|  ~Y^^  \n")
    incorrect += color("     ~Y^^^^      \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}
