class Item {
  /**
   *
   * @param {string} name
   * @param {string} description
   */
  constructor(name, description = "") {
    this.name = name;
    this.description = description;
  }

  toString() {
    return this.name;
  }
}

module.exports = { Item };
