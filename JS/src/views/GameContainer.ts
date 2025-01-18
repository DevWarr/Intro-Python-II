import { Container, ContainerOptions } from "pixi.js";

export class GameContainer {
  constructor(
    public containerOptions: ContainerOptions,
    public container: Container = new Container(containerOptions),
  ) {}
}
