import { ContainerOptions, Container } from "pixi.js";
import { buildTextListWithColors } from "./buildTextListWithColors";
import { GuardianName } from "../models/Guardians";

export class GuardianQuestionContainer {
  constructor(
    containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  public renderGuardianQuestion(guardianName: GuardianName, guardianDescription: string, guardianQuestion: string) {
    this.container.removeChildren();
    [`~W${guardianName}`, `~g${guardianDescription}`, guardianQuestion].forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
