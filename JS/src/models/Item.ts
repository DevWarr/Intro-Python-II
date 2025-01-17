export class Item {
  constructor(
    private __name: string,
    private __description: string = "",
  ) {}

  public get name() {
    return this.__name;
  }

  public get description() {
    return this.__description;
  }

  toString() {
    return this.name;
  }
}
