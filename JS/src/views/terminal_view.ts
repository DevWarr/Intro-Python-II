import { sleep } from "../utils/time";

const map_key = ["~Y[ ]~e You are here", "[A] Artifact Shrine", "[X] Cave Entrance", "[S] Shrine", "~W[ ]~e Has Item"];

const battle_info_template = ["Questions remaining: ", "Tries left: "];

const inventory_header_template = " Inventory:";

const room_sign = {
  empty: "   ",
  tunnel: "[ ]",
  entrance: "[X]",
  shrine: "[S]",
  artifact: "[A]",
};

const getRoomSignFromRoom = (room, entranceRoom) => {
  if (!room) {
    return room_sign["empty"];
  } else if (room.name.includes("Artifact")) {
    return room_sign["artifact"];
  } else if (room instanceof Shrine) {
    return room_sign["shrine"];
  } else if (room === entranceRoom) {
    return room_sign["entrance"];
  } else {
    return room_sign["tunnel"];
  }
};

const getRoomColorFromRoom = (room, playerRoom) => {
  if (playerRoom && room === playerRoom) {
    // Player is in the room? Yellow
    return "~Y";
  } else if (room && room.inventory.length > 0) {
    // Room has any items in it? White
    return "~W";
  } else return "";
};

const formatRoomSymbol = (room, playerRoom, entranceRoom) => {
  return getRoomColorFromRoom(room, playerRoom) + getRoomSignFromRoom(room, entranceRoom) + "~e";
};

class TerminalView {
  constructor(adv) {
    this.adv = adv;
    this.map_key = map_key;
    this.map = null;
    this.build_map_display(this.adv.game_map.map);
    this.player_inv = null;

    this.guardian_pose = null;
    this.fight_info = null;

    this.wide_info = null;
    this.controls = null;

    this.left_size = [23, 5];
    this.mid_size = [29, 5];
    this.right_size = [27, 5];
  }

  /**
   * Displays Game Map.
   *
   * Rooms with items are bold, and the player position is yellow.
   */
  build_map_display(self, mapArray, playerRoom = None) {
    const entranceRoom = mapArray[4][1];

    let output = mapArray
      .map((roomArr) => {
        return roomArr.map((room) => formatRoomSymbol(room, playerRoom, entranceRoom)).join("");
      })
      .join("\n");

    self.map = output;
  }

  prepScreen() {
    const controller = this.adv.controller;
    let left, mid, right;

    if (controller instanceof IntroController) {
      left = this.map;
      mid = this.map_key;
      right = this.player_inv;
    } else if (controller instanceof TravelController) {
      left = this.map;
      mid = this.map_key;
      right = this.player_inv;
    } else {
      left = this.guardian_pose;
      mid = this.fight_info;
      right = this.player_inv;
    }

    [left, mid, right] = this.prep_top_view(left, mid, right);

    output = "";
    // for i in range(0, 5):
    // // Add our three code blocks together, one by one
    // output += left[i] + mid[i] + right[i] + "\n"

    // output += "\n"
    // for i in range(0, 3):
    // // Add our lower text information
    // output += this.wide_info[i] + "\n"

    // Add our controls and print
    return "\n" + output + "\n" + this.controls;
  }
}
