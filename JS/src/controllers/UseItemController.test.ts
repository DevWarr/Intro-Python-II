import { Guardian, GuardianPose } from "../models/Guardians";
import { Player } from "../models/Player";
import { Room, RoomType } from "../models/Room";
import { UseItemController } from "./UseItemController";

describe("UseItemController", () => {
  let useItemController: UseItemController;
  let mockPlayer: Player;
  let mockRoom: Room;
  let mockGuardian: Guardian;

  beforeEach(() => {
    jest.resetAllMocks();
    mockPlayer = {
      inventory: {
        hasItem: jest.fn(),
      },
    } as unknown as Player;
    mockRoom = {
      roomType: RoomType.ENTRANCE,
    } as unknown as Room;
    mockGuardian = {
      decrementTriesLeft: jest.fn(),
      removeCurrentQuestion: jest.fn(),
    } as unknown as Guardian;
    useItemController = new UseItemController();
  });

  describe("useItemInRoom", () => {
    it("should return a validation response if the item name is missing", () => {
      const response = useItemController.useItemInRoom(mockPlayer, mockRoom);

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RPlease type the ~c(name)~R of the item you wish to use.");
    });

    it("should return a validation response if the item is not in the player's inventory", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(false);

      const response = useItemController.useItemInRoom(mockPlayer, mockRoom, "item");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~c(item)~R is not in your inventory.");
    });

    it("should return a validation response when item isn't artifact and not in entrance", () => {
      (mockRoom as Record<string, any>).roomType = RoomType.TUNNEL;
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);

      const response = useItemController.useItemInRoom(mockPlayer, mockRoom, "item");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RYou can't use the ~c(Item)~R outside of battle.");
    });

    it("should return a validation response when item isn't artifact and in entrance", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);

      const response = useItemController.useItemInRoom(mockPlayer, mockRoom, "calculator");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RThe ~c(Calculator)~R isn't the right item to use here.");
    });

    it("should return a validation response if the artifact is used in the wrong room", () => {
      (mockRoom as Record<string, any>).roomType = RoomType.TUNNEL;
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);

      const response = useItemController.useItemInRoom(mockPlayer, mockRoom, "artifact");

      expect(response.actionSuccess).toBe(false);
      expect(response.responseToPlayer).toBe("~RYou can't use the ~c(Artifact)~R in this room.");
    });

    it("should return a success response if the artifact is used in the entrance room", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);

      const response = useItemController.useItemInRoom(mockPlayer, mockRoom, "artifact");

      expect(response.actionSuccess).toBe(true);
      expect(response.responseToPlayer).toBe("~GYou escaped the Cave!");
    });
  });

  describe("useItemInBattle", () => {
    it("should return a validation response if the item name is missing", () => {
      const response = useItemController.useItemInBattle(mockPlayer, mockGuardian);

      expect(response.guardianPose).toBe(GuardianPose.STAND);
      expect(response.responseToPlayer).toBe("~RPlease type the ~c(name)~R of the item you wish to use.");
    });

    it("should return a validation response if the item is not in the player's inventory", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(false);

      const response = useItemController.useItemInBattle(mockPlayer, mockGuardian, "item");

      expect(response.guardianPose).toBe(GuardianPose.STAND);
      expect(response.responseToPlayer).toBe("~RYou do not have ~c(item)~R!");
    });

    it("should return a validation response if the guardian is expecting a number", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);
      (mockGuardian as Record<string, any>).correctAnswer = 1;

      const response = useItemController.useItemInBattle(mockPlayer, mockGuardian, "item");

      expect(response.guardianPose).toBe(GuardianPose.STAND);
      expect(response.responseToPlayer).toBe("~RYou can't use an item right now.");
    });

    it("should return a validation response if the item is incorrect", () => {
      (mockPlayer.inventory.hasItem as jest.Mock).mockReturnValue(true);

      const response = useItemController.useItemInBattle(mockPlayer, mockGuardian, "wrong");

      expect(mockGuardian.decrementTriesLeft).toHaveBeenCalledTimes(1);
      expect(response.guardianPose).toBe(GuardianPose.INCORRECT);
      expect(response.responseToPlayer).toBe("~c(wrong)~R is not the correct item!");
    });
  });
});
