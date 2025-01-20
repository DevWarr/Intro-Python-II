import { GameMap } from "../models/GameMap";
import { Player } from "../models/Player";
import { ResponseContainer } from "../views/ResponseContainer";

export class ExplorationState {
  constructor(
    private gameMap: GameMap,
    private player: Player,
    private responseContainer: ResponseContainer,
  ) {}

  public async processInput(inputString: string, resetInputCallback: () => void) {
    await this.responseContainer.renderResponse(inputString, 1);
    resetInputCallback();
  }
}
