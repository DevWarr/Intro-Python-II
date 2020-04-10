# Adventure Game

## Understand

### MVP

-   What can the user type as input?
    -   "n":               North
    -   "s":               South
    -   "e":               East
    -   "w":               West
    -   "q":               Quit
    -   "i":               Inventory
    -   "take|get [item]": picking up an item from current room
    -   "drop [item]":     dropping an item in current room
    -   "use [item]":      uses whatever the item can do
    -   Error for invalid input without killing loop
-   What is the max space we will use in the terminal?
    -   80 characters long
    -   10 lines high
-   What does a Room need?
    -   id
    -   name
    -   description
    -   attached rooms
        -   (now handled by map)
    -   inventory
-   What does a Player need?
    -   name
    -   current room
        -   (now held by map)
    -   inventory
-   What does an Item need?
    -   name
    -   description
    -   on_take (print message and any extra code)
    -   on_drop (print message and any extra code)
    -   on_use (player uses item)

### Stretch Goals

-   Adventure map?
    -   2d array of rooms
    -   n/s/e/w traversal
-   Can we save our game?
    -   Not that important, very short game
-   How many rooms will there be?
-   Can rooms/games be procedurally generated?
-   How to calculate Score?
-   How to differentiate light/dark rooms?
-   How do you win?
-   Monsters?

## Plan

-   main loop
    -   Take in user input
    -   Traverse 

-   Making the map
    -   Map = 2d array
    -   [+]      [ ][ ]
        [ ][ ][*][ ][-]
        [ ]   [ ]   [ ]
        [ ][/]      [ ]
        [ ][ ]   [A][ ]
    -   Empty spaces -> Empty Rooms
    -   Symbols -> Special rooms with monsters that drop items
    -   No random generation
    1.  Create 2d array with rooms
        -   name
        -   desc
        -   monster, if any
    2.  Link rooms together
        -   n_to, s_to, etc

-   Winning the Game
    -   Getting the Ancient Mathematical Artifact
    -   Artifact its locked: needs other items

-   Shrines
    -   extends Room class
    -   Contains a Guardian (or None if it's defeated)
    -   Multip Shrine
        -   Monster: Multip Guardian
        -   Requires: Calculator
        -   Item: Multip
    -   Divid Shrine
        -   Monster: Divid Guardian
        -   Requires: Calculator
        -   Item: Divid
    -   Square Shrine
        -   Monster: Square Guardian
        -   Requires: Calculator, Multip
        -   Item: Square
    -   Root Shrine
        -   Monster: Root Guardian
        -   Requires: Calculator, Divid, Square
        -   Item: Root
    -   Artifact Shrine
        -   Monster: Mathematical Guardian
        -   Requires: Calculator, Multip, Divid, Square, Root
        -   Item: Multip

-   Guardians
    -   extends Player class
    -   quiz method
        -   Asks five questions

    -   Mutip Guardian:
        -   add_question(x5)

    -   Divid Guardian:
        -   sub_question(x5)
    
    -   Square Guardian(Multip):
        -   add_question(x2)
        -   mult_question(x3)
    
    -   Root Guardian(Divid):
        -   sub_question(x2)
        -   squ_question(x1)
        -   div_question(x2)
    
    -   Artifact Guarian(Square, Root):
        -   mult_question(x1)
        -   div_question(x1)
        -   squ_question(x1)
        -   root_question(x1)
        -   final_question(x1)
    -   1 Guardian for every Shrine
    -   On quiz success -> Death
    -   On death, drop all items

-   Battles
    -   Must have proper item(s) to fight
    -   Guardian gives 5 questions
        -   First two require calc
        -   3rd (or onward) require second item
        -   4th (or onward) require third item
        -   5th (Artifact only) requires all items
    -   Must enter required item to answer question
    -   Examples:
        -   "You need the calculator!"
        -   "What is: 10 plus itself 5 times?"
        -   '>> 50'
        -   "Correct!"

        -   "You need the Multip sign!"
        -   "What is: 5 times itself twice?"
        -   '>> 25'
        -   "Correct!"

        -   "You need the Root sign!"
        -   "What is the square root of 49?"
        -   '>> 7h'
        -   "Not Quite. Try again!"
        -   '>> 7'
        -   "Correct!"
    -   Can run away to previous location
    -   Three wrong answers, and you're forced to run away!
    -   Guess all correct, Guardian dies and drops sign in room