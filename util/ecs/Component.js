/**
 * Basically the Component is a transparent object proxy whose purpose is to allow
 * getter/setter/deleter operations on the component's state object, while syntactically
 * allowing you to access those methods like a POJO.  However, because of the abstraction,
 * you can formalize metadata about the component, such as its name, and the methods
 * by the design respecting $PROP syntax.  This can be useful to make both of these
 * first-class citizens of the component, as component metadata can be equally as
 * important as the component's state.
 */
export class Component {
	constructor ({ $preserve = false, $name, ...state } = {}) {
		/**
		 * Seed the name property
		 */
		this.$name = $name;

		/**
		 * Seed the state property
		 */
		this.$state = Object.assign({}, { ...state });

		/**
		 * Optionally track changes to the state
		 */
		this.$history = [];

		/**
		 * Reset the state to its initial value
		 */
		this.$reset = () => this.$state = Object.assign({}, state);

		return new Proxy(this, {
			get: (target, name) => {
				if(name[ 0 ] === "$") {
					return Reflect.get(target, name);
				}

				return target.$state[ name ];
			},
			set: (target, name, value) => {
				if(name[ 0 ] === "$") {
					return Reflect.set(target, name, value);
				}

				target.$state[ name ] = value;
				if($preserve === true) {
					target.$history.push({ ...target.$state });
				}

				return true;
			},
			deleteProperty: (target, name) => {
				if(name[ 0 ] === "$") {
					return Reflect.deleteProperty(target, name);
				}

				delete target.$state[ name ];

				return true;
			},
		});
	}

	static Create({ ...args } = {}) {
		return new this({ ...args });
	}
	static Attach(entity, { $name, ...args } = {}) {
		entity[ $name ] = this.Create({ $name, ...args });

		return entity;
	}
	static Detach(entity, { $name } = {}) {
		delete entity[ $name ];

		return entity;
	}
};

export function Factory({ $name, ...args } = {}, qty = 1) {
	const components = [];

	for(let i = 0; i < qty; i++) {
		components.push(new Component({ $name, ...args }));
	}

	return components;
};

export default Component;