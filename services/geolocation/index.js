import React from "react";

import { Registry } from "./../../util/Registry";

export const Context = React.createContext({
	/**
	 * This will be populated with the GPS result
	 */
	geolocation: {},

	/**
	 * This will be a collection of (optionally aliases) geofencing polygons
	 */
	geofences: new Registry(),
});

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

export function withGeolocation(Component) {
	return function WrapperComponent(props) {
		return (
			<Consumer>
				{ context => <Component { ...props } geo={ context } /> }
			</Consumer>
		);
	}
};

export function useGeolocation() {
	if(!window.navigator.geolocation) {
		throw new Error("Geolocation is not supported");
	}

	const ctx = React.useContext(Context);
	const [ position, setPosition ] = React.useState(false);
	const refresh = () => window.navigator.geolocation.getCurrentPosition(pos => {
		ctx.geolocation = pos;

		setPosition(pos);
	});

	React.useEffect(refresh, []);

	return [ position, refresh ];
};

export default Context;