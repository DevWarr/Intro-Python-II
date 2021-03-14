# Rarer Symbols:
# ‾
# √

# ========================================
# REMEMBER:
# While each variable looks like
# it's being assigned sloppy text,
# that's only because they will be
# formatted to proper colors when printed.
# ========================================


def divid_guardian():
  """
  Prints out an ASCII version of the 
  Divid Guardian. 
   (/)  -//-  8)  
    Y___|##|__9]  
    8===]//[==97  
    I‾‾‾|][|‾‾    
    I __J/\\\__   

    Y   -//-  8)  
    8‾=_|##|__9]  
    I‾-=]//[==97  
    I   |][|‾‾    
      __J/\\\__   
  """
  stand = "~C(~B/~C)~e  -~B//~e-  8)  \n" + \
      " ~WY~e___|~r##~e|__9]  \n" + \
      " ~W8~e===]~B//~e[==97  \n" + \
      " ~WI~e‾‾‾|]~x[~e|‾‾    \n" + \
      " ~WI~e _~W_~e~wJ/~x\\~e\~W_~e_   \n"

  correct = " ~WY~e   -~B//~e-  8)  \n" + \
      " ~W8~e‾=_|~r##~e|__9]  \n" + \
      " ~WI~e‾-=]~B//~e[==97  \n" + \
      " ~WI~e   |]~x[~e|‾‾    \n" + \
      "   _~W_~e~wJ/~x\\~e\~W_~e_   \n"

  incorrect = " ~RY~e   -~B//~e-  8)  \n" + \
      " ~R8~e‾=_|~r##~e|__9]  \n" + \
      " ~WI~e‾-=]~B//~e[==97  \n" + \
      " ~WI~e   |]~x[~e|‾‾    \n" + \
      "   _~W_~e~wJ/~x\\~e\~W_~e_   \n"

  return {"stand": stand, "correct": correct, "incorrect": incorrect}


def multip_guardian():
  """
  Prints out an ASCII version of the 
  Multip Guardian. 
   (*)  +**+      
    Y___|##|==9\  
    8===]**[‾‾97  
    I   |][|      
    I   [][L      

    Y   +**+      
    8‾=_|##|==9\  
    I‾-=]**[‾‾97  
    I   |][|      
        [][L      
  """
  stand = "~C(~B*~C)~e  +~B**~e+      \n" + \
      " ~WY~e___|~r##~e|==9\  \n" + \
      " ~W8~e===]~B**~e[‾‾97  \n" + \
      " ~WI~e   |][|      \n" + \
      " ~WI~e   ~w[]~x[L~e      \n"

  correct = " ~WY~e   +~B**~e+      \n" + \
      " ~W8~e‾=_|~r##~e|==9\  \n" + \
      " ~WI~e‾-=]~B**~e[‾‾97  \n" + \
      " ~WI~e   |][|      \n" + \
      "     ~w[]~x[L~e      \n"

  incorrect = " ~RY~e   +~B**~e+      \n" + \
      " ~R8~e‾=_|~r##~e|==9\  \n" + \
      " ~WI~e‾-=]~B**~e[‾‾97  \n" + \
      " ~WI~e   |][|      \n" + \
      "     ~w[]~x[L~e      \n"

  return {"stand": stand, "correct": correct, "incorrect": incorrect}


def square_guardian():
  """
  Prints out an ASCII version of the 
  Square Guardian. 
   (^)  *^^*  +*  
    Y___|##|__()  
    8===]^^[==97  
    I   |][|      
    I   [][]      

    Y   *^^*  +*  
    8‾=_|##|__()  
    I‾-=]^^[==97  
    I   |][|      
        [][]      
  """
  stand = "~C(~B^~C)~e  *~B^^~e*  ~W+*~e  \n" + \
      " ~WY~e___|~r##~e|__()  \n" + \
      " ~W8~e===]~B^^~e[==9~x7~e  \n" + \
      " ~WI~e   |][|      \n" + \
      " ~WI~e   ~w[]~x[]~e      \n"

  correct = " ~WY~e   *~B^^~e*  ~W+*~e  \n" + \
      " ~W8~e‾=_|~r##~e|__()  \n" + \
      " ~WI~e‾-=]~B^^~e[==9~x7~e  \n" + \
      " ~WI~e   |][|      \n" + \
      "     ~w[]~x[]~e      \n"

  incorrect = " ~RY~e   *~B^^~e*  ~W+*~e  \n" + \
      " ~R8~e‾=_|~r##~e|__()  \n" + \
      " ~WI~e‾-=]~B^^~e[==9~x7~e  \n" + \
      " ~WI~e   |][|      \n" + \
      "     ~w[]~x[]~e      \n"

  return {"stand": stand, "correct": correct, "incorrect": incorrect}


def radical_guardian():
  """
  Prints out an ASCII version of the 
  Root Guardian. 
   (√)  ^√√^      
    Y___|##|==()  
    8===]//[‾‾97  
    I   |][|  ^^  
    I   ^^^^      

    Y   ^√√^      
    8‾=_|##|==()  
    I‾-=]//[‾‾97  
    I   |][|  ^^  
        ^^^^      
  """
  stand = "~C(~B√~C)~e  ^~B√√~e^      \n" + \
      " ~WY~e___|~r##~e|==()  \n" + \
      " ~W8~e===]//[‾‾97  \n" + \
      " ~WI~e   |][|  ^^  \n" + \
      " ~WI~e   ~y^^^^~e      \n"

  correct = " ~WY~e   ^~B√√~e^      \n" + \
      " ~W8~e‾=_|~r##~e|==()  \n" + \
      " ~WI~e‾-=]//[‾‾97  \n" + \
      " ~WI~e   |][|  ^^  \n" + \
      "     ~y^^^^~e      \n"

  incorrect = " ~RY~e   ^~B√√~e^      \n" + \
      " ~R8~e‾=_|~r##~e|==()  \n" + \
      " ~WI~e‾-=]//[‾‾97  \n" + \
      " ~WI~e   |][|  ^^  \n" + \
      "     ~y^^^^~e      \n"

  return {"stand": stand, "correct": correct, "incorrect": incorrect}


def artifact_guardian():
  """
  Prints out an ASCII version of the 
  Artifact Guardian. 
    +A* *//*      
    (8__|##|==9\  
    (q==]--[‾‾97  
        |][|  ^^  
        ^^^^      

        *//*      
    +A*_|##|==9\  
    (R==]--[‾‾97  
        |][|  ^^  
        ^^^^      

    (8  *//*      
     \=\|##|==9\  
      `‾]--[‾‾97  
        |][|  ^^  
        ^^^^      
  """
  stand = " ~C*~BA~C+~e *~B//~e*      \n" + \
      " ~W(8~X__~W|~e~r##~W|~X--~W9~e\  \n" + \
      " ~W(q~X==~W]~BAA~W[~X‾‾~W97~e  \n" + \
      "     ~W|]~X[|  ~Y^^~e  \n" + \
      "     ~Y^^^^~e      \n"

  correct = " ~W(8~e  *~B//~e*      \n" + \
      "  ~W\=~X\~W|~e~r##~W|~X--~W9~e\  \n" + \
      "   ~X`‾~W]~BAA~W[~X‾‾~W97~e  \n" + \
      "     ~W|]~X[|  ~Y^^~e  \n" + \
      "     ~Y^^^^~e      \n"

  incorrect = "     *~B//~e*      \n" + \
      " ~R*A+~e_~W|~e~r##~W|~X--~W9~e\  \n" + \
      "  ~WR~X==~W]~BAA~W[~X‾‾~W97~e  \n" + \
      "     ~W|]~X[|  ~Y^^~e  \n" + \
      "     ~Y^^^^      \n"

  return {"stand": stand, "correct": correct, "incorrect": incorrect}




all_poses = {
    "Multip Guardian": multip_guardian(),
    "Divid Guardian": divid_guardian(),
    "Square Guardian": square_guardian(),
    "Radical Guardian": radical_guardian(),
    "Artifact Guardian": artifact_guardian(),
}

try:
    print(__name__)
    import pkg_resources
    pkg_resources.require([
        'PIL>=1.0.0'
    ])
    from .GIF import all_poses as gif_poses
except:
    pass