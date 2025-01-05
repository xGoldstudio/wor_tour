import { useRef } from "react";

export default function useDebounce(cb: () => void, delay: number) {
	const timeoutCallId = useRef<number | null>(null);

	function run(useCb: boolean) {
		timeoutCallId.current = setTimeout(() => {
			if (useCb) cb();
			timeoutCallId.current = null;
		}, delay);
	}

	function onDebounce() {
		if (timeoutCallId.current !== null) {
			clearTimeout(timeoutCallId.current);
			run(true);
		} else {
			cb();
			run(false);
		}
	}

	function onForceDebounce() {
		if (timeoutCallId.current !== null) {
			clearTimeout(timeoutCallId.current);
		}
		run(true);
	}

	return [onDebounce, onForceDebounce] as const;
}