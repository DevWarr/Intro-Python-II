from tkinter import *
from tkinter import ttk
from tkinter import font
from time import sleep
from controllers.intro_controller import IntroController
from controllers.game_controllers import TravelController, BattleController
from models.game_map import GameMap
from models.guardians import Guardian
from models.player import Player
from models.room import Room
from models.shrine import Shrine
from utils.string_utilities import is_white_substring, is_item_substring
from .controls_view import Controls

map_key_template = {
    "images": [
        "[ ]",
        "[A]",
        "[X]",
        "[S]",
        "[ ]"
    ],
    "text": [
        "You are here",
        "Artifact Shrine",
        "Cave Entrance",
        "Shrine",
        "Has Item"
    ]
}

fight_info_template = [
    "Questions remaining: ",
    "Tries left: "
]

room_sign = {
    "empty": "   ",
    "tunnel": "[ ]",
    "entrance": "[X]",
    "shrine": "[S]",
    "artifact": "[A]"
}


class TkinterView:
  """
  Creates a dispaly that matches this diagram.
  Blocks of space in the terminal (column = 3; row = 9):
   |______________________________________________________________
   |[                    ][                   ][                  ]
   |[      Label         ][       Frame       ][     Frame        ]   ↑↑↑
   |[      Image         ][       Info1       ][     Info2        ]  3 rows
   |[                    ][                   ][                  ]   ↓↓↓
   |[____________________][___________________][__________________]
   | ____________________________________________________________
   |[                                                             ]   ↑↑↑
   |[   Label Or Frame:Info 3    -   -   -    -   -  -   -        ]  3 rows
   |[_____________________________________________________________]   ↓↓↓
   | _____________________________________________________________
   |[____Label: Controls__________________________________________]  1 row
   |[____Entry: Input_____________________________________________]  1 row
   |[____Label: Response__________________________________________]  1 row
  """

  def __init__(self, adv):
    self.adv           = adv
    self.root          = self.create_window()
    self.fonts         = {
        "fixed_font": font.Font(family="Consolas", size=16),
        "fixed_font_bold": font.Font(family="Consolas", size=16, weight='bold')
    }
    self.style         = self.create_styles()
    self.main_frame    = self.create_main_frame()

    self.map_key       = self.build_map_key()
    self.map           = self.build_map_display(self.adv.game_map.map)
    self.player_info   = self.build_player_inventory()

    self.guardian_pose = self.build_guardian_pose()
    self.fight_info    = self.build_fight_info()

    self.wide_info     = self.build_wide_info()
    self.controls      = self.build_controls()

    self.input         = self.build_input()
    self.response      = self.build_response()
    self.root.bind("<Key>", self.setup_input_detection)

  def create_window(self):
    root = Tk()
    root.minsize(600, 300)
    root.geometry("1200x600")

    def resize_font(e):
      for font in self.fonts.values():
        font["size"] = root.winfo_width() // 75
        font["size"] = root.winfo_width() // 75

    root.bind("<Configure>", resize_font)
    root.protocol("WM_DELETE_WINDOW", self.adv.quit_game)
    return root

  def create_main_frame(self):
    frame = ttk.Frame(self.root, width=500, height=500)
    frame.grid(column=0, row=0, sticky=(N, W, E, S))
    self.root.columnconfigure(0, weight=1)
    self.root.rowconfigure(0, weight=1)
    return frame

  def create_styles(self):
    style = ttk.Style()
    style.theme_use("default")
    style.configure("TFrame", background="black")
    style.configure(
        "TLabel", font=self.fonts["fixed_font"], foreground="#AAAAAA", background="black")
    style.configure(
        "Gray.TLabel", font=self.fonts["fixed_font"], foreground="#888888")
    style.configure(
        "White.TLabel", font=self.fonts["fixed_font_bold"], foreground="white")
    style.configure(
        "Blue.TLabel", font=self.fonts["fixed_font"], foreground="#8888FF")
    style.configure(
        "Red.TLabel", font=self.fonts["fixed_font_bold"], foreground="red")
    style.configure(
        "Green.TLabel", font=self.fonts["fixed_font"], foreground="green")
    style.configure(
        "GreenBold.TLabel", font=self.fonts["fixed_font_bold"], foreground="green")
    style.configure(
        "Yellow.TLabel", font=self.fonts["fixed_font_bold"], foreground="yellow")
    return style

  def build_map_display(self, map_array):
    """
    Displays Game Map.

    Rooms with items are bold, and the player position is yellow.
    """
    entrance_room = map_array[4][1]

    frame = ttk.Frame(self.main_frame)
    map_display = [[None] * len(map_array[0])] * len(map_array)

    for row in range(len(map_array)):
      for column in range(len(map_array[0])):

        room = map_array[row][column]
        if room is None:
          continue

        label = ttk.Label(frame)
        # First ifs to determine Label text
        if room.name[:8] == "Artifact":
          label["text"] = room_sign["artifact"]
        elif isinstance(room, Shrine):
          label["text"] = room_sign["shrine"]
        elif room is entrance_room:
          label["text"] = room_sign["entrance"]
        else:
          label["text"] = room_sign["tunnel"]

        if room is not None and len(room.inv) > 0:
          # Room has any items in it? White
          label["style"] = "White.TLabel"
        label.grid(row=row, column=column)
        map_display[row][column] = label

    frame.grid(column=0, row=0, rowspan=3, pady=30)
    return {"frame": frame, "map_display": map_display}

  def build_map_key(self):
    frame = ttk.Frame(self.main_frame)

    for i in range(len(map_key_template["images"])):
      image = map_key_template["images"][i]
      style = "TLabel"
      if i == 0:
        style = "Yellow.TLabel"
      if i == 4:
        style = "White.TLabel"
      ttk.Label(frame, text=image, style=style).grid(column=0, row=i)

    for i in range(len(map_key_template["text"])):
      text = map_key_template["text"][i]
      ttk.Label(frame, text=text).grid(
          column=1, row=i, sticky="w", padx=(10, 0))

    frame.columnconfigure(1, weight=1)
    # frame.grid(column=1, row=0, rowspan=3, pady=30)
    return {"frame": frame}

  def build_player_inventory(self):
    frame = ttk.Frame(self.main_frame)

    header = ttk.Frame(frame)
    header.grid(column=0, row=0)
    player_name = StringVar()
    ttk.Label(header, textvariable=player_name,
              style="White.TLabel").pack(side=LEFT)
    ttk.Label(header, text="Inventory", style="White.TLabel").pack(side=RIGHT)

    inventory = [StringVar(), StringVar(), StringVar(), StringVar()]
    for i in range(len(inventory)):
      str_var = inventory[i]
      inv_label = ttk.Label(frame, textvariable=str_var, style="Blue.TLabel")
      inv_label.grid(column=0, row=i + 1, padx=(15, 0), sticky="w")

    frame.grid(column=2, row=0, rowspan=3, pady=30)
    return [player_name] + inventory

  def build_guardian_pose(self):
    frame = ttk.Frame(self.main_frame)
    frame.grid(column=0, row=0, rowspan=3, pady=30)
    return {"frame": frame}

  def build_fight_info(self):
    frame = {
        "frame": ttk.Frame(self.main_frame),
        "question_count": StringVar(),
        "try_count": StringVar()
    }

    questions = ttk.Frame(frame["frame"])
    ttk.Label(questions, text=fight_info_template[0]).pack(side=LEFT)
    ttk.Label(questions, textvariable=frame["question_count"], style="White.TLabel").pack(
        side=RIGHT)
    questions.grid(column=0, row=0, sticky="w", pady=(0, 20))

    tries = ttk.Frame(frame["frame"])
    ttk.Label(tries, text=fight_info_template[1]).pack(side=LEFT)
    ttk.Label(tries, textvariable=frame["try_count"],
              style="White.TLabel").pack(side=RIGHT)
    tries.grid(column=0, row=1, sticky="w", pady=(0, 20))

    # frame["frame"].grid(column=1, row=0, rowspan=3, pady=30)
    return frame

  def build_wide_info(self):
    frame = ttk.Frame(self.main_frame)
    name = StringVar()
    description = StringVar()
    extra_frame = ttk.Frame(frame)

    ttk.Label(frame, textvariable=name, style="White.TLabel").grid(
        row=0, column=0, sticky="w")
    ttk.Label(frame, textvariable=description,
              style="Green.TLabel").grid(row=1, column=0, sticky="w")
    extra_frame.grid(row=2, column=0, sticky="w")

    frame.grid(column=0, row=3, columnspan=3, rowspan=3, pady=25, sticky="w")
    return {
        "frame": frame,
        "name": name,
        "description": description,
        "extra_frame": extra_frame,
        "guardian_question": ""
    }

  def build_controls(self):
    # Controls.SIMPLE
    s = ttk.Frame(self.main_frame)
    ttk.Label(s, text="[n]", style="White.TLabel").pack(side=LEFT, padx=5)
    ttk.Label(s, text="North").pack(side=LEFT, padx=5)
    ttk.Label(s, text="[s]", style="White.TLabel").pack(side=LEFT, padx=5)
    ttk.Label(s, text="South").pack(side=LEFT, padx=5)
    ttk.Label(s, text="[e]", style="White.TLabel").pack(side=LEFT, padx=5)
    ttk.Label(s, text="East").pack(side=LEFT, padx=5)
    ttk.Label(s, text="[w]", style="White.TLabel").pack(side=LEFT, padx=5)
    ttk.Label(s, text="West").pack(side=LEFT, padx=5)
    ttk.Label(s, text="[o]", style="Yellow.TLabel").pack(side=LEFT, padx=5)
    ttk.Label(s, text="More Controls").pack(side=LEFT, padx=5)
    ttk.Label(s, text="[q]", style="Red.TLabel").pack(side=LEFT, padx=5)
    ttk.Label(s, text="Quit").pack(side=LEFT, padx=5)

    # Controls.ADVANCED
    a = ttk.Frame(self.main_frame)
    ttk.Label(a, text="[take ", style="White.TLabel").pack(side=LEFT)
    ttk.Label(a, text="(item)", style="Blue.TLabel").pack(side=LEFT)
    ttk.Label(a, text="]", style="White.TLabel").pack(side=LEFT)
    ttk.Label(a, text=" from room  ").pack(side=LEFT)
    ttk.Label(a, text="[drop ", style="White.TLabel").pack(side=LEFT)
    ttk.Label(a, text="(item)", style="Blue.TLabel").pack(side=LEFT)
    ttk.Label(a, text="]", style="White.TLabel").pack(side=LEFT)
    ttk.Label(a, text=" from inventory  ").pack(side=LEFT)
    ttk.Label(a, text="[o]", style="Yellow.TLabel").pack(side=LEFT)
    ttk.Label(a, text=" previous pontrols").pack(side=LEFT)

    # Controls.BATTLE
    b = ttk.Frame(self.main_frame)
    ttk.Label(b, text="Type the ").pack(side=LEFT)
    ttk.Label(b, text="answer", style="White.TLabel").pack(side=LEFT)
    ttk.Label(b, text=" to the question, ").pack(side=LEFT)
    ttk.Label(b, text="use ", style="White.TLabel").pack(side=LEFT)
    ttk.Label(b, text="(item)", style="Blue.TLabel").pack(side=LEFT)
    ttk.Label(b, text=", or ").pack(side=LEFT)
    ttk.Label(b, text="run away", style="White.TLabel").pack(side=LEFT)
    ttk.Label(b, text="!").pack(side=LEFT)

    # Controls.INTRO
    i = ttk.Frame(self.main_frame)
    ttk.Label(i, text="Once you're good to go, ").pack(side=LEFT)
    ttk.Label(i, text="type a player name",
              style="White.TLabel").pack(side=LEFT)
    ttk.Label(i, text=" to begin. Or, type ").pack(side=LEFT)
    ttk.Label(i, text="[q]", style="White.TLabel").pack(side=LEFT)
    ttk.Label(i, text=" to quit.").pack(side=LEFT)

    # Controls.EMPTY
    e = ttk.Frame(self.main_frame)
    ttk.Label(e, text="   ").pack(side=LEFT)

    i.grid(row=6, column=0, columnspan=3, sticky="w", pady=10)
    return [s, a, b, i, e]

  def build_input(self):
    frame = ttk.Frame(self.main_frame)
    input_str = StringVar()
    ttk.Label(frame, text=">>  ").pack(side=LEFT)
    ttk.Label(frame, textvariable=input_str).pack(side=LEFT)

    frame.grid(row=7, column=0, columnspan=3, sticky="w")
    return {"frame": frame, "input": input_str, "on": True}

  def build_response(self):
    frame = ttk.Frame(self.main_frame)
    frame.grid(row=8, column=0, columnspan=3, sticky="w")
    return {"frame": frame}

  def update_guardian_info(self, guardian):
    ef = self.wide_info["extra_frame"]
    [piece.destroy() for piece in ef.winfo_children()]

    self.wide_info["name"].set(guardian.name)
    self.wide_info["description"].set(guardian.description)

    if guardian.question is None:
      info_list = [" "]
    else:
      info_list = guardian.question.split(" ")

    if len(info_list) > 1 and f"{info_list[0]} {info_list[1]}" == guardian.name:
      # If we're asking for an item, ↑↑↑
      # add style changes to the guardian's name, and the item
      item_name = info_list[-1]
      rest_of_text = " ".join(info_list[2:-1])
      ttk.Label(ef, text=f"{guardian.name} ", style="White.TLabel").pack(side=LEFT)
      ttk.Label(ef, text=f"{rest_of_text} ").pack(side=LEFT)
      ttk.Label(ef, text=item_name, style="Blue.TLabel").pack(side=LEFT)
    else:
      # If we're just asking a math question,
      # Make the numbers and key words bold
      text = ""
      for i in range(len(info_list)):
        word = info_list[i]
        if word.isdigit() or "square" in word or "cube" in word:
          ttk.Label(ef, text=text).pack(side=LEFT)
          text = ""
          ttk.Label(ef, text=f"{word} ", style="White.TLabel").pack(side=LEFT)
        else:
          text += f"{word} "
      ttk.Label(ef, text=text).pack(side=LEFT)
      

  def update_guardian(self, guardian):
    self.fight_info["question_count"].set(guardian.question_count)
    self.fight_info["try_count"].set(guardian.try_count)
    # TODO: Update Guardian image

    # If our question changed, update the wide info
    if guardian.question != self.wide_info["guardian_question"]:
      self.update_guardian_info(guardian)

  def update_room_info(self, room):
    ef = self.wide_info["extra_frame"]
    [piece.destroy() for piece in ef.winfo_children()]

    self.wide_info["name"].set(room.name)
    self.wide_info["description"].set(room.description)

    ttk.Label(ef, text="[ ", style="White.TLabel").pack(side=LEFT)

    if len(room.inv) > 0:
      # If we have items, create a label for each item name
      [ttk.Label(ef, text=f"({str(item)}) ", style="Blue.TLabel").pack(
          side=LEFT) for item in room.inv]
    else:
      # If we don't have items, display "empty"
      ttk.Label(ef, text="empty ", style="Gray.TLabel").pack(side=LEFT)
    ttk.Label(ef, text="]", style="White.TLabel").pack(side=LEFT)

  def update_controls(self, control_enum):
    [frame.forget_grid() for frame in self.controls if hasattr(frame, "forget_grid")]
    idx = control_enum.value
    self.controls[idx].grid(row=6, column=0, columnspan=3, sticky="w", pady=10)

  def update_player(self, player):
    player_name = self.player_info[0]
    if player_name.get() != player.name:
      player_name.set(player.name)

    player_inv = player.inv
    for info_idx in range(1, 5):
      player_idx = info_idx - 1
      if player_idx < len(player_inv):
        item_name = f"({player_inv[player_idx]})"
        self.player_info[info_idx].set(item_name)
      else:
        self.player_info[info_idx].set("")

  def update_map(self, map_array, player_room):
    for row in range(len(map_array)):
      for column in range(len(map_array[0])):
        room = map_array[row][column]
        if room is None:
          continue

        label = self.map["map_display"][row][column]

        if room == player_room:
          label["style"] = "Yellow.TLabel"
        elif len(room.inv) > 0:
          label["style"] = "White.TLabel"
        else:
          label["style"] = "TLabel"

  def update(self, *args):
    game_map = None
    player   = None

    for update_me in args:
      if isinstance(update_me, Guardian):
        self.update_guardian(update_me)
      elif isinstance(update_me, Room):
        self.update_room_info(update_me)
      elif isinstance(update_me, Controls):
        self.update_controls(update_me)
      elif isinstance(update_me, GameMap):
        game_map = update_me
      elif isinstance(update_me, Player):
        player = update_me
        self.update_player(player)

    if game_map is not None and player is not None:
      self.update_map(game_map.map, player.current_room)

  def update_controller(self):
    if isinstance(self.adv.controller, IntroController):
      if hasattr(self.fight_info["frame"], "forget_grid"):
        self.fight_info["frame"].forget_grid()
      self.map_key["frame"].grid(column=1, row=0, rowspan=3, pady=30)

    if isinstance(self.adv.controller, TravelController):
      if hasattr(self.fight_info["frame"], "forget_grid"):
        self.fight_info["frame"].forget_grid()
      self.map_key["frame"].grid(column=1, row=0, rowspan=3, pady=30)
      if hasattr(self.guardian_pose["frame"], "forget_grid"):
        self.guardian_pose["frame"].forget_grid()
      self.map["frame"].grid(column=0, row=0, rowspan=3, pady=30)

    if isinstance(self.adv.controller, BattleController):
      if hasattr(self.map_key["frame"], "forget_grid"):
        self.map_key["frame"].forget_grid()
      self.fight_info["frame"].grid(column=1, row=0, rowspan=3, pady=30)
      if hasattr(self.map["frame"], "forget_grid"):
        self.map["frame"].forget_grid()
      self.guardian_pose["frame"].grid(column=0, row=0, rowspan=3, pady=30)

  def setup_input_detection(self, event):
    if not self.input["on"]:
      return
    input_str = self.input["input"]
    if event.keysym == "Return":
      user_in = input_str.get()
      input_str.set("")
      self.adv.controller.main(user_in)
    elif event.keysym == "BackSpace":
      input_str.set(f"{input_str.get()[0:-1]}")
    else:
      key = event.char
      input_str.set(f"{input_str.get()}{key}")

  def send_response(self, response_type, msg, *values, sec_to_wait=None):
    frame = self.response["frame"]

    word_count = len(msg.split(" "))
    if sec_to_wait is None:
      sec_to_wait = max(1, word_count / 2.5 - 1)

    if response_type == "error":
      style = "Red.TLabel"
    elif response_type == "battle":
      style = "Yellow.TLabel"
    else:
      style = "TLabel"

    start = 0
    end = start
    value_idx = 0
    while end < len(msg):
      if not is_item_substring(msg, end) and not is_white_substring(msg, end):
        # If we don't find any important news, keep looping
        end += 1
        continue

      # Formatting found? Create the labels and place them in
      text = msg[start:end]
      ttk.Label(frame, text=text, style=style).pack(side=LEFT)

      if is_item_substring(msg, end):
        item = f"({values[value_idx]})"
        ttk.Label(frame, text=item, style="Blue.TLabel").pack(side=LEFT)
        end += 4
      if is_white_substring(msg, end):
        item = f"{values[value_idx]}"
        ttk.Label(frame, text=item, style="White.TLabel").pack(side=LEFT)
        end += 2

      value_idx += 1
      start = end
    if end > start:
      text = msg[start:end]
      ttk.Label(frame, text=text, style=style).pack(side=LEFT)

    self.input["on"] = False
    frame.after(int(sec_to_wait * 1000), self.erase_response)

  def erase_response(self):
    self.input["on"] = True
    [piece.destroy() for piece in self.response["frame"].winfo_children()]

  def start_game(self):
    return

  def fade_out(self):
    self.black_out()

  def black_out(self):
    return
