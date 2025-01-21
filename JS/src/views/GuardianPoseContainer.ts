import { ContainerOptions, Container } from "pixi.js";
import { buildTextListWithColors } from "./buildTextListWithColors";
import { GuardianName, GuardianPose } from "../models/Guardians";
import { GUARDIAN_POSES, GuardianPoseStringDictionary } from "./guardianPoses";

export class GuardianPoseContainer {
  constructor(
    containerOptions: ContainerOptions,
    private guardianPoses: GuardianPoseStringDictionary = GUARDIAN_POSES,
    public container: Container = new Container(containerOptions),
  ) {}

  public renderGuardian(guardianName: GuardianName, guardianPose: GuardianPose) {
    const guardianPoseToRender: string[] = this.guardianPoses[guardianName][guardianPose];

    this.container.removeChildren();
    guardianPoseToRender.forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
