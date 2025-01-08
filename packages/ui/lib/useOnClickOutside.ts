import { RefObject, useEffect } from 'react';

export default function useOnClickOutside(ref: RefObject<HTMLDivElement>, cb: () => void, watching: boolean = true) {
	useEffect(() => {
		if (!watching) {
			return;
		}
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				cb();
			}
		}
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [ref, watching]);
}