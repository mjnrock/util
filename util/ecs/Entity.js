import { Identity } from "./Identity";

/**
 * The Entity class is a container for components.  Because it can sometimes
 * be useful to witness *any* change to an entity, the Entity class is also
 * a proxy that can be observed for "set" and "delete" events.
 * 
 * Confer System for its own event variant and rationale.
 * > "I want to process effects when an Entity updates its state."
 */
export class Entity extends Identity {
	constructor ({ id, tags, observers = [], ...components } = {}) {
		super({ id, tags });

		for(const [ name, component ] of Object.entries(components)) {
			this[ name ] = component;
		}

		this.$observers = new Set(observers);

		return new Proxy(this, {
			set: (target, name, value) => {
				if(name[ 0 ] === "$") {
					return Reflect.set(target, name, value);
				}

				target[ name ] = value;

				for(const observer of target.$observers) {
					observer(target.id, name, Object.assign({}, value));
				}

				return true;
			},
			deleteProperty: (target, name) => {
				if(name[ 0 ] === "$") {
					return Reflect.deleteProperty(target, name);
				}

				delete target[ name ];

				for(const observer of target.$observers) {
					observer(target.id, name, undefined);
				}

				return true;
			},
		});
	}

	$watch(...observers) {
		for(const observer of observers) {
			this.$observers.add(observer);
		}

		return this;
	}
	$unwatch(...observers) {
		for(const observer of observers) {
			this.$observers.delete(observer);
		}

		return this;
	}
};

export default Entity;