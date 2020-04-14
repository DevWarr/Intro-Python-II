from classes.room import Room
from classes.player import Player
from classes.item import Item
from classes.game_map import Map
from classes.battle import Battle
from utils.colors import color
from utils.music import MusicPlayer, SoundPlayer
from utils.display_screen import display_screen, print_and_wait, fade_out
from assets.guardian_poses import multip_guardian
from os import terminal_size
import time

music_player = MusicPlayer()
sound_player = SoundPlayer()


def is_direction(val) -> bool:
    """Returns true if a cardinal direction"""
    return val == 'n' or val == 's' or val == 'e' or val == 'w'


def is_answering_math(user_in) -> bool:
    """Returns true if user is answering a math problem during battle"""
    if user_in[0] == "answer":
        return len(user_in) > 1 and user_in[1].isdigit()
    else:
        return user_in[0].isdigit()


def battle(battle):
    """Main loop for battles in the adventure game"""

    # Tell the guardian to prep the quiz with the initially required item
    battle.guardian.prep_quiz()

    controls = "Type the ~Wanswer~e to the question, ~Wuse ~e~c(item)~e, or ~Wrun away~e!"
    win_or_lose = None

    while True:

        # Check if we've won or lost
        # If we have, break the loop
        win_or_lose = battle.check_victory()
        if win_or_lose is not None:
            break

        # Create a question
        battle.create_question()
        # Display battle info and wait for input
        display_screen(*battle.display_info(), controls)
        user_in = input(">> ").lower().strip().split(" ")

        if user_in[0] == "q":
            sound_player.play_track(5)
            sure = input("Quit the Game. Are you sure? [Y/N]>> ").lower().strip()
            if sure == "y":
                music_player.stop_track()
                sound_player.stop_track()
                exit()
            else:
                continue
        elif " ".join(user_in) == "run away":
            # Running away?
            # Lose the battle, set win_or_lose to None ('cause we didn't win or lose), and break
            battle.lose()
            win_or_lose = None
            break

        elif user_in[0] == "use":
            # Using an item

            if len(user_in) < 2:
                # User didn't actually type an item to use? Error message 'em
                sound_player.play_track(6)
                print_and_wait(
                    "~RPlease type the ~e~c(name)~R of the item you wish to use.")

            else:
                item_name = " ".join(user_in[1:])
                correct_item = battle.check_item(item_name)

                if correct_item[0] is None:
                    # No item? Display error message
                    print_and_wait(f"~RYou do not have ~e~c({item_name})~R!")
                elif correct_item[0]:
                    # Correct item? Make the guardian dance a little, and display text
                    item_name = correct_item[1]
                    sound_player.play_track(2)
                    display_screen(*battle.display_info("correct"),
                                   controls)
                    print_and_wait(f"~WYou used ~e~c({item_name})~W!", 1)
                else:
                    # Incorrect item? Angry guardian!
                    item_name = correct_item[1]
                    sound_player.play_track(3)
                    display_screen(*battle.display_info("incorrect"),
                                   controls)
                    print_and_wait(
                        f"~c({item_name}) ~Ris not the correct item!", 1)

        elif is_answering_math(user_in):
            # User's input is a number?
            # Submit it to the guardian for checking.

            if user_in[0] == "answer":
                # If the user typed the word answer, the second 'word' is their math answer
                answer = int(user_in[1])
            else:
                # Else, the first 'word' is their math answer
                answer = int(user_in[0])

            correct_answer = battle.check_answer(answer)

            if correct_answer:
                # Correct answer? Make the guardian dance a little, and display text
                sound_player.play_track(2)
                display_screen(*battle.display_info("correct"),
                               controls)
                print_and_wait(f"~Y{answer} ~Wis correct!", 1)
            else:
                # Incorrect answer? Angry guardian!
                sound_player.play_track(3)
                display_screen(*battle.display_info("incorrect"),
                               controls)
                print_and_wait(
                    f"~Y{answer} ~Ris not the correct answer!", 1)

        else:
            # Not a proper input? Display help message
            print_and_wait(
                "~RYou must ~Wuse ~e~c(item)~R, ~Wanswer~R the math problem, or ~Wrun away~R!")

    # Handling the end of battle
    if win_or_lose is None:
        # Running away
        sound_player.play_track(7)
        print_and_wait("~YYou ran away!", 1.3)
    elif win_or_lose is True:
        # Winning the battle
        sound_player.play_track(1)
        print_and_wait(f"~YYou defeated the ~W{battle.guardian.name}~Y!", 2)
    else:
        # Losing the battle
        sound_player.play_track(0)
        print(color("~YYou lost the battle! You have to run away!"))
        time.sleep(0.6)
        sound_player.play_track(0)
        time.sleep(0.6)
        sound_player.play_track(0)
        time.sleep(0.8)

    fade_out(*battle.display_info(), controls)
    return


def game(adv):
    """Main Loop for the adventure game"""

    music_player.play_track()
    controls = [
        "~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest   ~Y[o] ~eMore controls     ~R[q] ~eQuit",
        "~W[take ~e~c(item)~W]~e from room   ~W[drop ~e~c(item)~W]~e from inventory   ~Y[o]~e previous controls"
    ]
    display = False  # False -> simple  |  True -> advanced
    credits_bool = False

    while True:

        # Check if there's a guardian in our room
        guardian = adv.check_for_guardian()
        if guardian is not None:
            # If there is a guardian, start battle
            sound_player.play_track(4)
            fade_out(*adv.display_info(), controls[display])
            battle(Battle(adv.player, guardian, adv))

        # Display map screen and wait for input
        display_screen(*adv.display_info(), controls[display])
        user_in = input(">> ").lower().strip().split(" ")

        if user_in[0] == 'q':
            # Quitting the Game
            music_player.stop_track()
            sound_player.stop_track()
            break
        elif user_in[0] == 'o':
            # Toggle controls
            sound_player.play_track(5)
            display = not display
        elif is_direction(user_in[0]):
            # Moving through the map
            success = adv.move(user_in[0])
            if success:
                sound_player.play_track(5)
                continue
            else:
                sound_player.play_track(6)
                print_and_wait("~RThere is no room that way . . .", 1)
        elif user_in[0] == 'take':
            # Taking an item
            if len(user_in) > 1:
                sound_player.play_track(5)
                item_name = " ".join(user_in[1:])
                print_and_wait(adv.take_item(item_name))
            else:
                sound_player.play_track(6)
                print_and_wait(
                    "~RPlease type the ~e~c(name)~R of the item you wish to take.")
        elif user_in[0] == 'drop':
            # Dropping an item
            if len(user_in) > 1:
                sound_player.play_track(5)
                item_name = " ".join(user_in[1:])
                print_and_wait(adv.drop_item(item_name))
            else:
                sound_player.play_track(6)
                print_and_wait(
                    "~RPlease type the ~e~c(name)~R of the item you wish to drop.")
        elif user_in[0] == 'use':
            # Using an item
            if len(user_in) > 1:
                item_name = " ".join(user_in[1:])
                success = adv.use_item(item_name)
                if success[0] is None:
                    sound_player.play_track(6)
                    print_and_wait(f"~c({name})~R is not in your inventory.")
                elif success[0]:
                    credits_bool = True
                    break
                else:
                    sound_player.play_track(6)
                    print_and_wait(f"~RYou can't use ~e~c({success[1]}) ~Rhere.")
            else:
                sound_player.play_track(6)
                print_and_wait(
                    "~RPlease type the ~e~c(name)~R of the item you wish to use.")
        else:
            # Invalid input
            sound_player.play_track(6)
            print_and_wait("~RInvalid input. Please try again . . .", 1)
    
    if credits_bool:
        # Clear the screen, cut the music
        display_screen("", "", "", "", "")
        sound_player.play_track(7)
        time.sleep(0.3)
        music_player.stop_track()
        time.sleep(0.6)

        # Display credits with the correct jingle
        display_screen("", "\n\n\n~WThanks for playing!~e\n  - Devin Warrick", "", "", "")
        sound_player.play_track(2)
        time.sleep(3)
    exit()


def intro():
    """Intro before Game starts"""
    music_player.play_track(1)
    terminal_size((82, 16))
    intro_text = [
        "[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]\n[ ][ ][ ][ ][ ]",
        multip_guardian()["stand"],
        "~WPlayer's Inventory~e\n  ~c(item1)~e\n  ~c(item2)~e",
        "|——————————————————————————————————————————————————————————————————————————————|\n~WThis adventure game requires a terminal 80 characters wide and 15 lines tall.~e\nIf you can't see all of this text, please resize your terminal.",
        "Once you're good to go, ~Wtype a player name~e to begin. Or, type ~W[q]~e to quit."
    ]

    player = None
    while True:

        # Display the intro and wait for input
        display_screen(*intro_text)
        print("\n")
        user_in = input(">> ").strip()

        if len(user_in) == 0:
            # No name? Reset the loop
            continue
        elif len(user_in) > 15:
            # Name too long? Sorry bub.
            print_and_wait(
                "~RThat name is too long! Please have a name less than 15 characters.")
        elif user_in == 'q':
            # q -> quit
            music_player.stop_track()
            sound_player.stop_track()
            break
        else:
            # Valid input? Use it as the name
            player = Player(
                user_in, [Item("Calculator", "Simple Calculator. Can add and subtract."), Item("Artifact")])
            music_player.stop_track()
            sound_player.play_track(5)
            for i in range(0, 6):
                display_screen(*intro_text)
                print("\n")
                print(color("~BStarting Game ." + " ."*(i % 3)))
                time.sleep(0.5)
            break
    if player:
        # If the player entered a name, start. If not, exit.
        adv = Map(player)
        fade_out(*intro_text)
        game(adv)


if __name__ == "__main__":

    # Wrap everything in a try/except, so if an error is thrown
    #     we stop our players and exit peacefully
    try:
        intro()
    except Exception as e:
        music_player.stop_track()
        sound_player.stop_track()
        raise e
