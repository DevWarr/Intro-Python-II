from models.guardians import Guardian, ArtifactGuardian
from models.room import Room
from models.shrine import Shrine
from assets.guardian_poses import all_poses

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


def create_map_display(map_array, entrance_room, player_room):
  """
  Displays Game Map.

  Rooms with items are bold, and the player position is yellow.
  """
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
      if room is player_room:
        # Player is in the room? Yellow
        room_str = f"~Y{room_str}~e"
      elif room is not None and len(room.inv) > 0:
        # Room has any items in it? White
        room_str = f"~W{room_str}~e"
      temp += room_str

    output += temp + "\n"
  return output

def create_guardian_display(guardian, pose):
  return all_poses[guardian.name][pose]