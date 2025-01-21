import { ContainerOptions, Container } from "pixi.js";
import { buildTextListWithColors } from "./buildTextListWithColors";

const QUESTIONS_REMAINING = "Questions remaining: ";
const TRIES_LEFT = "Tries left: ";

export class BattleInfoContainer {
  constructor(
    containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}

  public renderBattleInfo(questionsRemaining: number, triesLeft: number) {
    this.container.removeChildren();
    // We have an empty string in this list to create an extra line
    //     of vertical space between the questions remaining and tries left
    [`${QUESTIONS_REMAINING}~W${questionsRemaining}`, "", "", `${TRIES_LEFT}~W${triesLeft}`].forEach((text, index) => {
      const pixiTextObjects = buildTextListWithColors(text, index);
      pixiTextObjects.forEach((pixiTextObject) => this.container.addChild(pixiTextObject));
    });
  }
}
