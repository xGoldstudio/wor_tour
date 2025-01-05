import { RefObject, useEffect } from 'react';

export default function useOnClickOutside(ref: RefObject<HTMLDivElement>, cb: () => void) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				cb();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}