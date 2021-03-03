class Item {
	constructor(name, description = '') {
		this.name = name;
		this.description = description;
	}

	toString() {
		return this.name;
	}
}

module.exports = { Item };
