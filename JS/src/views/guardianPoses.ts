// Rarer Symbols:
// ‾
// √

import { GuardianName, GuardianPose } from "../models/Guardians";

// ========================================
// REMEMBER:
// While each variable looks like
// it's being assigned sloppy text,
// that's only because they will be
// formatted to proper colors when printed.
// ========================================

export type GuardianPoseStringDictionary = Record<GuardianName, Record<GuardianPose, string[]>>;

export const GUARDIAN_POSES: GuardianPoseStringDictionary = {
  /*
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
  */
  [GuardianName.DIVID]: {
    [GuardianPose.STAND]: [
      "~C(~B/~C)~e  -~B//~e-  8)  ",
      " ~WY~e___|~r##~e|__9]  ",
      " ~W8~e===]~B//~e[==97  ",
      " ~WI~e‾‾‾|]~x[~e|‾‾    ",
      " ~WI~e _~W_~e~wJ/~x\\~e\\~W_~e_   ",
    ],

    [GuardianPose.CORRECT]: [
      " ~WY~e   -~B//~e-  8)  ",
      " ~W8~e‾=_|~r##~e|__9]  ",
      " ~WI~e‾-=]~B//~e[==97  ",
      " ~WI~e   |]~x[~e|‾‾    ",
      "   _~W_~e~wJ/~x\\~e\\~W_~e_   ",
    ],

    [GuardianPose.INCORRECT]: [
      " ~RY~e   -~B//~e-  8)  ",
      " ~R8~e‾=_|~r##~e|__9]  ",
      " ~WI~e‾-=]~B//~e[==97  ",
      " ~WI~e   |]~x[~e|‾‾    ",
      "   _~W_~e~wJ/~x\\~e\\~W_~e_   ",
    ],
  },
  /*
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
  */
  [GuardianName.MULTIP]: {
    [GuardianPose.STAND]: [
      "~C(~B*~C)~e  +~B**~e+      ",
      " ~WY~e___|~r##~e|==9\\  ",
      " ~W8~e===]~B**~e[‾‾97  ",
      " ~WI~e   |][|      ",
      " ~WI~e   ~w[]~x[L~e      ",
    ],

    [GuardianPose.CORRECT]: [
      " ~WY~e   +~B**~e+      ",
      " ~W8~e‾=_|~r##~e|==9\\  ",
      " ~WI~e‾-=]~B**~e[‾‾97  ",
      " ~WI~e   |][|      ",
      "     ~w[]~x[L~e      ",
    ],

    [GuardianPose.INCORRECT]: [
      " ~RY~e   +~B**~e+      ",
      " ~R8~e‾=_|~r##~e|==9\\  ",
      " ~WI~e‾-=]~B**~e[‾‾97  ",
      " ~WI~e   |][|      ",
      "     ~w[]~x[L~e      ",
    ],
  },
  /*
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
  */
  [GuardianName.SQUARE]: {
    [GuardianPose.STAND]: [
      "~C(~B^~C)~e  *~B^^~e*  ~W+*~e  ",
      " ~WY~e___|~r##~e|__()  ",
      " ~W8~e===]~B^^~e[==9~x7~e  ",
      " ~WI~e   |][|      ",
      " ~WI~e   ~w[]~x[]~e      ",
    ],

    [GuardianPose.CORRECT]: [
      " ~WY~e   *~B^^~e*  ~W+*~e  ",
      " ~W8~e‾=_|~r##~e|__()  ",
      " ~WI~e‾-=]~B^^~e[==9~x7~e  ",
      " ~WI~e   |][|      ",
      "     ~w[]~x[]~e      ",
    ],

    [GuardianPose.INCORRECT]: [
      " ~RY~e   *~B^^~e*  ~W+*~e  ",
      " ~R8~e‾=_|~r##~e|__()  ",
      " ~WI~e‾-=]~B^^~e[==9~x7~e  ",
      " ~WI~e   |][|      ",
      "     ~w[]~x[]~e      ",
    ],
  },
  /*
  Prints out an ASCII version of the 
  Radical Guardian. 
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
  */
  [GuardianName.RADICAL]: {
    [GuardianPose.STAND]: [
      "~C(~B√~C)~e  ^~B√√~e^      ",
      " ~WY~e___|~r##~e|==()  ",
      " ~W8~e===]//[‾‾97  ",
      " ~WI~e   |][|  ^^  ",
      " ~WI~e   ~y^^^^~e      ",
    ],

    [GuardianPose.CORRECT]: [
      " ~WY~e   ^~B√√~e^      ",
      " ~W8~e‾=_|~r##~e|==()  ",
      " ~WI~e‾-=]//[‾‾97  ",
      " ~WI~e   |][|  ^^  ",
      "     ~y^^^^~e      ",
    ],

    [GuardianPose.INCORRECT]: [
      " ~RY~e   ^~B√√~e^      ",
      " ~R8~e‾=_|~r##~e|==()  ",
      " ~WI~e‾-=]//[‾‾97  ",
      " ~WI~e   |][|  ^^  ",
      "     ~y^^^^~e      ",
    ],
  },
  /*
  Prints out an ASCII version of the 
  Artifact Guardian. 
    +A* */ /*      
    (8__|##|==9\  
    (q==]--[‾‾97  
        |][|  ^^  
        ^^^^      

        */ /*      
    +A*_|##|==9\  
    (R==]--[‾‾97  
        |][|  ^^  
        ^^^^      

    (8  */ /*      
     \=\|##|==9\  
      `‾]--[‾‾97  
        |][|  ^^  
        ^^^^      
  */
  [GuardianName.ARTIFACT]: {
    [GuardianPose.STAND]: [
      " ~C*~BA~C+~e *~B//~e*      ",
      " ~W(8~X__~W|~e~r##~W|~X--~W9~e\\  ",
      " ~W(q~X==~W]~BAA~W[~X‾‾~W97~e  ",
      "     ~W|]~X[|  ~Y^^~e  ",
      "     ~Y^^^^~e      ",
    ],

    [GuardianPose.CORRECT]: [
      " ~W(8~e  *~B//~e*      ",
      "  ~W\=~X\~W|~e~r##~W|~X--~W9~e\\  ",
      "   ~X`‾~W]~BAA~W[~X‾‾~W97~e  ",
      "     ~W|]~X[|  ~Y^^~e  ",
      "     ~Y^^^^~e      ",
    ],

    [GuardianPose.INCORRECT]: [
      "     *~B//~e*      ",
      " ~R*A+~e_~W|~e~r##~W|~X--~W9~e\\  ",
      "  ~WR~X==~W]~BAA~W[~X‾‾~W97~e  ",
      "     ~W|]~X[|  ~Y^^~e  ",
      "     ~Y^^^^      ",
    ],
  },
};
