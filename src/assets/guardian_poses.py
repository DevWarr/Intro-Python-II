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
    stand = color("~C(~B/~C)~e  -~B//~e-  8)  \n" +
                  " ~WY~e___|~r##~e|__9]  \n" +
                  " ~W8~e===]~B//~e[==97  \n" +
                  " ~WI~e‾‾‾|]~x[~e|‾‾    \n" +
                  " ~WI~e _~W_~e~wJ/~x\\~e\~W_~e_   \n")

    correct = color(" ~WY~e   -~B//~e-  8)  \n" +
                    " ~W8~e‾=_|~r##~e|__9]  \n" +
                    " ~WI~e‾-=]~B//~e[==97  \n" +
                    " ~WI~e   |]~x[~e|‾‾    \n" +
                    "   _~W_~e~wJ/~x\\~e\~W_~e_   \n")

    incorrect = color(" ~RY~e   -~B//~e-  8)  \n" +
                      " ~R8~e‾=_|~r##~e|__9]  \n" +
                      " ~WI~e‾-=]~B//~e[==97  \n" +
                      " ~WI~e   |]~x[~e|‾‾    \n" +
                      "   _~W_~e~wJ/~x\\~e\~W_~e_   \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}


def multip_guardian():
    """
    Prints out an ASCII version of the 
    Multip Guardian. \n
     (*)  +**+      \n
      Y___|##|==9\  \n
      8===]**[‾‾97  \n
      I   |][|      \n
      I   [][L      \n
      \n
      Y   +**+      \n
      8‾=_|##|==9\  \n
      I‾-=]**[‾‾97  \n
      I   |][|      \n
          [][L      \n
    """
    stand = color("~C(~B*~C)~e  +~B**~e+      \n" +
                  " ~WY~e___|~r##~e|==9\  \n" +
                  " ~W8~e===]~B**~e[‾‾97  \n" +
                  " ~WI~e   |][|      \n" +
                  " ~WI~e   ~w[]~x[L~e      \n")

    correct = color(" ~WY~e   +~B**~e+      \n" +
                    " ~W8~e‾=_|~r##~e|==9\  \n" +
                    " ~WI~e‾-=]~B**~e[‾‾97  \n" +
                    " ~WI~e   |][|      \n" +
                    "     ~w[]~x[L~e      \n")

    incorrect = color(" ~RY~e   +~B**~e+      \n" +
                      " ~R8~e‾=_|~r##~e|==9\  \n" +
                      " ~WI~e‾-=]~B**~e[‾‾97  \n" +
                      " ~WI~e   |][|      \n" +
                      "     ~w[]~x[L~e      \n")

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
    stand = color("~C(~B^~C)~e  *~B^^~e*  ~W+*~e  \n" +
                  " ~WY~e___|~r##~e|__()  \n" +
                  " ~W8~e===]~B^^~e[==9~x7~e  \n" +
                  " ~WI~e   |][|      \n" +
                  " ~WI~e   ~w[]~x[]~e      \n")

    correct = color(" ~WY~e   *~B^^~e*  ~W+*~e  \n" +
                    " ~W8~e‾=_|~r##~e|__()  \n" +
                    " ~WI~e‾-=]~B^^~e[==9~x7~e  \n" +
                    " ~WI~e   |][|      \n" +
                    "     ~w[]~x[]~e      \n")

    incorrect = color(" ~RY~e   *~B^^~e*  ~W+*~e  \n" +
                      " ~R8~e‾=_|~r##~e|__()  \n" +
                      " ~WI~e‾-=]~B^^~e[==9~x7~e  \n" +
                      " ~WI~e   |][|      \n" +
                      "     ~w[]~x[]~e      \n")

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
    stand = color("~C(~B√~C)~e  ^~B√√~e^      \n" +
                  " ~WY~e___|~r##~e|==()  \n" +
                  " ~W8~e===]//[‾‾97  \n" +
                  " ~WI~e   |][|  ^^  \n" +
                  " ~WI~e   ~y^^^^~e      \n")

    correct = color(" ~WY~e   ^~B√√~e^      \n" +
                    " ~W8~e‾=_|~r##~e|==()  \n" +
                    " ~WI~e‾-=]//[‾‾97  \n" +
                    " ~WI~e   |][|  ^^  \n" +
                    "     ~y^^^^~e      \n")

    incorrect = color(" ~RY~e   ^~B√√~e^      \n" +
                      " ~R8~e‾=_|~r##~e|==()  \n" +
                      " ~WI~e‾-=]//[‾‾97  \n" +
                      " ~WI~e   |][|  ^^  \n" +
                      "     ~y^^^^~e      \n")

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
    stand = color(" ~C*~BA~C+~e *~B//~e*      \n" +
                  " ~W(8~X__~W|~e~r##~W|~X--~W9~e\  \n" +
                  " ~W(q~X==~W]~BAA~W[~X‾‾~W97~e  \n" +
                  "     ~W|]~X[|  ~Y^^~e  \n" +
                  "     ~Y^^^^~e      \n")

    correct = color(" ~W(8~e  *~B//~e*      \n" +
                    "  ~W\=~X\~W|~e~r##~W|~X--~W9~e\  \n" +
                    "   ~X`‾~W]~BAA~W[~X‾‾~W97~e  \n" +
                    "     ~W|]~X[|  ~Y^^~e  \n" +
                    "     ~Y^^^^~e      \n")

    incorrect = color("     *~B//~e*      \n" +
                      " ~R*A+~e_~W|~e~r##~W|~X--~W9~e\  \n" +
                      "  ~WR~X==~W]~BAA~W[~X‾‾~W97~e  \n" +
                      "     ~W|]~X[|  ~Y^^~e  \n" +
                      "     ~Y^^^^      \n")

    return {"stand": stand, "correct": correct, "incorrect": incorrect}
