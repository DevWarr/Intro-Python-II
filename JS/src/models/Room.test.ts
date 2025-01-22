import { Room, RoomType } from "./Room";
import { Shrine } from "./Room";
import { Guardian } from "./Guardians";
import { Inventory } from "./Inventory";
import { Item } from "./Item";

describe("Room", () => {
  test("Room creation has proper name, description, and type assigned", () => {
    const testRoom = new Room("testRoom", "testDescription", RoomType.TUNNEL);

    expect(testRoom.name).toEqual("testRoom");
    expect(testRoom.description).toEqual("testDescription");
    expect(testRoom.roomType).toEqual(RoomType.TUNNEL);
  });
});

describe("Shrine", () => {
  test("Shrine creation has proper guardian, name, description, type, and inventory assigned", () => {
    const mockGuardian = {} as unknown as Guardian;
    const testInventory = new Inventory([new Item("testItem")]);
    const testShrine = new Shrine(mockGuardian, "testShrine", "testDescription", testInventory);

    expect(testShrine.guardian).toEqual(mockGuardian);
    expect(testShrine.name).toEqual("testShrine");
    expect(testShrine.description).toEqual("testDescription");
    expect(testShrine.roomType).toEqual(RoomType.SHRINE);
    expect(testShrine.inventory).toEqual(testInventory);
  });
});
