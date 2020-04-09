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
        -   n_to
        -   s_to
        -   e_to
        -   w_to
    -   inventory
-   What does a Player need?
    -   name
    -   current room
    -   inventory
-   What does an Item need?
    -   name
    -   description
    -   on_take (print message and any extra code)
    -   on_drop (print message and any extra code)
    -   on_use (player uses item)

### Stretch Goals

-   Adventure map?
    -   1d array of rooms
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