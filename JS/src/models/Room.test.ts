import { Room, RoomType } from "./Room";

describe("Room", () => {
  test("Room creation has proper name, description, and type assigned", () => {
    const testRoom = new Room("testRoom", "testDescription", RoomType.TUNNEL);

    expect(testRoom.name).toEqual("testRoom");
    expect(testRoom.description).toEqual("testDescription");
    expect(testRoom.roomType).toEqual(RoomType.TUNNEL);
  });
});
