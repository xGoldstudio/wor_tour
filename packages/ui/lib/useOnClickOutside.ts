import { RefObject, useEffect } from 'react';

export default function useOnClickOutside(ref: RefObject<HTMLElement>, cb: () => void, options?: {
	watching?: boolean,
}) {
	useEffect(() => {
		if (options?.watching !== undefined && !options.watching) {
			return;
		}
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				cb();
			}
		}
		document.addEventListener("click", handleClickOutside, { passive: true });
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [ref, options?.watching]);
}