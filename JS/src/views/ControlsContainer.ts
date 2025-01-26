import { ContainerOptions, Container, Text } from "pixi.js";
import { buildTextListWithColors } from "./buildTextListWithColors";

export enum ControlType {
  SIMPLE = "SIMPLE",
  ADVANCED = "ADVANCED",
  BATTLE = "BATTLE",
  INTRO = "INTRO",
  EMPTY = "EMPTY",
}

const CONTROLS_TEXT: Record<ControlType, string> = {
  [ControlType.SIMPLE]:
    "~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest   ~Y[o] ~eMore controls      ~R[q] ~eQuit",
  [ControlType.ADVANCED]:
    "~W[take ~c(item)~W] ~efrom room   ~W[drop ~c(item)~W] ~efrom inventory    ~Y[o] ~eprevious controls",
  [ControlType.BATTLE]: "Type the ~Wanswer ~eto the question, ~Wuse ~c(item)~e, or ~Wrun away~e!",
  [ControlType.INTRO]: "Once you're good to go, ~Wtype a player name ~eto begin. Or, type ~W[q] ~eto quit.",
  [ControlType.EMPTY]: "",
};

export class ControlsContainer {
  constructor(
    containerOptions: ContainerOptions,
    readonly container: Container = new Container(containerOptions),

    private controlsMap: Record<ControlType, Container> = {
      [ControlType.SIMPLE]: new Container(),
      [ControlType.ADVANCED]: new Container(),
      [ControlType.BATTLE]: new Container(),
      [ControlType.INTRO]: new Container(),
      [ControlType.EMPTY]: new Container(),
    },
    private activeControl: ControlType = ControlType.SIMPLE,
  ) {
    // Kinda gross mapping, but Object.keys always returns a string[] and we need a ControlType[]
    (Object.keys(CONTROLS_TEXT) as ControlType[]).map((controlType) => {
      const textList: Text[] = buildTextListWithColors(CONTROLS_TEXT[controlType]);
      textList.forEach((pixiText) => this.controlsMap[controlType].addChild(pixiText));
    });

    Object.values(this.controlsMap).forEach((control) => {
      control.alpha = 0;
      this.container.addChild(control);
    });

    this.controlsMap[this.activeControl].alpha = 1;
  }

  public renderControlType(controlType: ControlType): void {
    this.controlsMap[this.activeControl].alpha = 0;
    this.controlsMap[controlType].alpha = 1;
    this.activeControl = controlType;
  }
}
