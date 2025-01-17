export class Item {
  constructor(
    public name: string,
    public description: string = "",
  ) {}

  toString() {
    return this.name;
  }
}
