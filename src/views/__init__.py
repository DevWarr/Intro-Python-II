from classes.guardians import Guardian, ArtifactGuardian
from classes.room import Room
from assets.guardian_poses import *

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


def create_battle_info_view(questions, tries):
  return [
      f"{battle_info_template[0]}~W{questions}",
      "",
      f"{battle_info_template[1]}~W{tries}",
      "",
      ""
  ]


def create_player_inventory_view(player):
  inventory_header = f"~W{player.name}'s{inventory_header_template}~e"

  inventory = [f"  ~c( {str(item)} )~e" for item in player.inv]
  while len(inventory) < 4:
    inventory.append("")
  return [inventory_header, *inventory]


def create_wide_infopanel_view(guardian_or_room):
  name = guardian_or_room.name
  description = "~g" + guardian_or_room.description + "~e"

  if isinstance(guardian_or_room, Guardian):
    guardian = guardian_or_room

    if isinstance(guardian, ArtifactGuardian):
      # If we fight the Artifact Guardian,
      # there are a few style changes to add to the description
      description = description.replace("run away", "~Wrun away~e~g")
      description = description.replace("won't", "~Wwon't")
      description += "~e"

    if guardian.question is None:
      info_list = ["None", " "]
    else:
      info_list = guardian.question.split(" ")
    if info_list[0] + " " + info_list[1] == guardian.name:
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

  if isinstance(guardian_or_room, Room):
    room = guardian_or_room
    item_names = [f"~c({str(item)})~e" for item in room.inv]
    item_string = ' '.join(item_names) if len(item_names) else "~xempty~e"
    info = f"Items: [ {item_string} ]"

  return [name, description, info]
