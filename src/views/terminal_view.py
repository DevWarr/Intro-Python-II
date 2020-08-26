from .controls_view import Controls, get_controls_text
from controllers.intro_controller import IntroController
from controllers.game_controllers import TravelController, BattleController
from models.player import Player, DebugPlayer
from models.game_map import GameMap
from models.guardians import Guardian, ArtifactGuardian
from models.room import Room, DebugRoom
from models.shrine import Shrine
from utils.colors import color
from utils.string_utilities import format_string_block, is_white_substring, is_item_substring
from assets.guardian_poses import all_poses
from os import system, terminal_size
from random import choice
from time import sleep


map_key = [
    "~Y[ ]~e You are here",
    "[A] Artifact Shrine",
    "[X] Cave Entrance",
    "[S] Shrine",
    "~W[ ]~e Has Item"
]

battle_info_template = [
    "Questions remaining: ",
    "Tries left: "
]

inventory_header_template = " Inventory:"

room_sign = {
    "empty": "   ",
    "tunnel": "[ ]",
    "entrance": "[X]",
    "shrine": "[S]",
    "artifact": "[A]"
}


class TerminalView:

  def __init__(self, adv):
    self.adv           = adv
    self.map_key       = map_key
    self.map           = None
    self.build_map_display(self.adv.game_map.map)
    self.player_inv    = None

    self.guardian_pose = None
    self.fight_info    = None

    self.wide_info     = None
    self.controls      = None

    self.left_size     = (23, 5)
    self.mid_size      = (29, 5)
    self.right_size    = (27, 5)
    terminal_size((82, 16))

  def build_fight_info(self, questions, tries):
    info = [
        f"{battle_info_template[0]}~W{questions}~e",
        "",
        f"{battle_info_template[1]}~W{tries}~e",
        "",
        ""
    ]
    self.fight_info = info

  def build_player_inventory(self, player):
    inventory_header = f"~W{player.name}'s{inventory_header_template}~e"

    inventory = [f"  ~c( {str(item)} )~e" for item in player.inv]
    while len(inventory) < 4:
      inventory.append("")
    self.player_inv = [inventory_header, *inventory]

  def build_guardian_info(self, guardian):
    name = f"~W{guardian.name}~e"
    description = "~g" + guardian.description + "~e"

    if isinstance(guardian, ArtifactGuardian):
      # If we fight the Artifact Guardian,
      # there are a few style changes to add to the description
      description = description.replace("run away", "~Wrun away~e~g")
      description = description.replace("won't", "~Wwon't")
      description += "~e"

    if guardian.question is None:
      info_list = [" "]
    else:
      info_list = guardian.question.split(" ")

    if len(info_list) > 1 and f"{info_list[0]} {info_list[1]}" == guardian.name:
      # If we're asking for an item, ↑↑↑
      # add style changes to the guardian's name, and the item
      info_list[0] = "~W" + info_list[0]
      info_list[1] += "~e"
      info_list[-1] = "~c" + info_list[-1] + "~e"
    else:
      # If we're just asking a math question,
      # Make the numbers and key words bold
      for i in range(len(info_list)):
        word = info_list[i]
        if word.isdigit() or "square" in word or "cube" in word:
          info_list[i] = "~W" + word + "~e"
    info = " ".join(info_list)

    self.wide_info = [name, description, info]

  def build_room_info(self, room):
    name = f"~W{room.name}~e"
    description = "~g" + room.description + "~e"

    item_names = [f"~c({str(item)})~e" for item in room.inv]
    item_string = ' '.join(item_names) if len(item_names) else "~xempty~e"
    info = f"Items: [ {item_string} ]"

    self.wide_info = [name, description, info]

  def build_map_display(self, map_array, player_room=None):
    """
    Displays Game Map.

    Rooms with items are bold, and the player position is yellow.
    """
    entrance_room = map_array[4][1]

    output = ""
    for room_arr in map_array:
      temp = ""
      for room in room_arr:
        room_str = ""
        # print(room.name)
        # First ifs to determine string
        if room is None:
          room_str = room_sign["empty"]
        elif room.name[:8] == "Artifact":
          room_str = room_sign["artifact"]
        elif isinstance(room, Shrine):
          room_str = room_sign["shrine"]
        elif room is entrance_room:
          room_str = room_sign["entrance"]
        else:
          room_str = room_sign["tunnel"]

        # Second ifs to determine color
        if player_room and room is player_room:
          # Player is in the room? Yellow
          room_str = f"~Y{room_str}~e"
        elif room is not None and len(room.inv) > 0:
          # Room has any items in it? White
          room_str = f"~W{room_str}~e"
        temp += room_str

      output += temp + "\n"
    self.map = output

  def build_guardian_pose(self, guardian):
    pose = guardian.pose.value
    self.guardian_pose = all_poses[guardian.name][pose]

  def update_guardian(self, guardian):
    questions = guardian.question_count
    tries     = guardian.try_count
    self.build_fight_info(questions, tries)
    self.build_guardian_info(guardian)
    self.build_guardian_pose(guardian)

  def update(self, *args):
    game_map = None
    player   = None

    for update_me in args:
      if isinstance(update_me, Guardian):
        self.update_guardian(update_me)
      elif isinstance(update_me, Room):
        self.build_room_info(update_me)
      elif isinstance(update_me, Controls):
        self.controls = get_controls_text(update_me)
      elif isinstance(update_me, GameMap):
        game_map = update_me
      elif isinstance(update_me, Player):
        player = update_me
        self.build_player_inventory(player)

    if game_map is not None and player is not None:
      self.build_map_display(game_map.map, player.current_room)

    self.display_screen()

  def prep_top_view(self, left, mid, right):
    return [
        format_string_block(left, *self.left_size),
        format_string_block(mid, *self.mid_size),
        format_string_block(right, *self.right_size)
    ]

  def prep_screen(self):
    controller = self.adv.controller
    if isinstance(controller, IntroController):
      left  = choice([self.guardian_pose, self.map])
      mid   = self.map_key
      right = self.player_inv
    elif isinstance(controller, TravelController):
      left  = self.map
      mid   = self.map_key
      right = self.player_inv
    else:
      left  = self.guardian_pose
      mid   = self.fight_info
      right = self.player_inv

    left, mid, right = self.prep_top_view(left, mid, right)

    output = ""
    for i in range(0, 5):
      # Add our three code blocks together, one by one
      output += left[i] + mid[i] + right[i] + "\n"

    output += "\n"
    for i in range(0, 3):
      # Add our lower text information
      output += self.wide_info[i] + "\n"

    # Add our controls and print
    return "\n" + output + "\n" + self.controls

  def display_screen(self):
    output = self.prep_screen()
    system('cls||clear')
    print(color(output))

  def start_game(self):
    output = self.prep_screen()
    for i in range(0, 6):
      system('cls||clear')
      print(color(output))
      print(color("~BStarting Game ." + " ." * (i % 3)))
      sleep(0.3)

  def fade_out(self):
    output_list = self.prep_screen().split("\n")
    for i in range(0, len(output_list)):
      output_list[i] = ""
      fading_output = "\n".join(output_list)
      system('cls||clear')
      print(color(fading_output))
      sleep(0.05)
    sleep(0.25)

  def print_and_wait(self, msg, sec_to_wait=None):
    """
    Prints a message, and waits a short while before continuing
    """
    print(color(msg))
    word_count = len(msg.split(" "))
    if sec_to_wait is None:
      sec_to_wait = max(1, word_count / 2.5 - 1)
    sleep(sec_to_wait)

  def send_response(self, response_type, msg, *values, sec_to_wait=None, cb=None):

    if response_type == "error":
      color = "~R"
    elif response_type == "battle":
      color = "~Y"
    else:
      color = "~e"

    i = 0
    while i < len(msg):
      if is_item_substring(msg, i):
        end_of_string = msg[i + 4:] if i + 4 < len(msg) else ""
        msg = msg[:i] + "~e~c" + msg[i:i + 4] + color + end_of_string
        i += 8
      if is_white_substring(msg, i):
        end_of_string = msg[i + 3:] if i + 3 < len(msg) else ""
        msg = msg[:i] + "~W" + msg[i:i + 3] + color + end_of_string
        i += 4
      i += 1
    msg = color + msg + "~e"
    self.print_and_wait(msg.format(*values), sec_to_wait=sec_to_wait)
    if cb is not None:
      cb()

  def black_out(self):
    system("cls||clear")
    print()

  def show_credits(self):
    self.black_out()
    self.adv.music_player.stop_track()
    self.adv.sound_player.play_track(7)
    sleep(0.9)
    # Display credits with the correct jingle
    self.map = ""
    self.map_key = "\n\n\n~WThanks for playing!~e\n  - Devin Warrick"
    self.player_inv = ""
    self.wide_info = ["", "", ""]
    self.controls = ""
    self.adv.sound_player.play_track(2)
    self.display_screen()
    sleep(3)
    self.adv.quit_game()

  def get_input(self, msg):
    return input(msg).strip()
