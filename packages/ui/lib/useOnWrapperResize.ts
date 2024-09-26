import { useEffect } from "react";
import { useOnMount, useOnUnMount } from "./lifecycle";

export default function useOnWrapperResize(
	onResize: (inputRef: HTMLDivElement) => void, 
	containerRef: React.RefObject<HTMLDivElement>,
) {
	function resize() {
		if (containerRef.current) {
			onResize(containerRef.current);
		}
	}

	useOnMount(() => {
		window.addEventListener("resize", resize);
	});

	useOnUnMount(() => {
		window.removeEventListener("resize", resize);
	});

	useEffect(() => {
		resize();
	}, [containerRef.current]);
}