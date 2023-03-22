import { v4 as uuid } from "uuid";

export class Identity {
	constructor ({ id, tags = [] } = {}) {
		this.id = id || uuid();
		this.tags = new Set(tags);
	}

	hasTag(...tags) {
		return tags.every(tag => this.tags.has(tag));
	}
	getTags() {
		return Array.from(this.tags);
	}
	addTag(...tags) {
		tags.forEach(tag => this.tags.add(tag));

		return this;
	}
	removeTag(...tags) {
		tags.forEach(tag => this.tags.delete(tag));

		return this;
	}
};

export default Identity;