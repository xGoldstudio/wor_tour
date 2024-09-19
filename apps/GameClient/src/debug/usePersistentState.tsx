import { useState } from "react";

export default function usePersistentState<T>(key: string, defaultValue: T): [T, (value: T | ((v: T) => T)) => void] {
	const [state, setState] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(error);
			return defaultValue;
		}
	});

	const setPersistentState = (value: (T | ((v: T) => T))) => {
		try {
			setState(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(error);
		}
	};

	return [state, setPersistentState];
}