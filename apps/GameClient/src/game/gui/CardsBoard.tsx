import { useEffect, useRef, useState } from "react";
import CardPlaceholder from "./CardPlaceholder";
import { useOnMount, useOnUnMount } from "@repo/ui";
import { inPx } from "@repo/lib";

const GAP = 16;
const WIDTH = 172;
const HEIGHT = 234.5;

const SIZE_W = inPx(WIDTH * 3 + GAP * 2);
const SIZE_H = inPx(HEIGHT * 2 + GAP);

export default function CardsBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState(1);

	useOnWrapperResize(onResize, containerRef);

	function onResize(inputRef: HTMLDivElement) {
		const width = inputRef.clientWidth;
		const height = inputRef.clientHeight;
		const size = Math.min(
			(width - (GAP * 3)) / (3 * WIDTH),
			(height - (GAP * 3)) / (2 * HEIGHT),
		);
		setSize(Math.min(size, 1));
	}

  return (
		<div className="w-full flex justify-center items-center h-full" ref={containerRef}>
			<div className="grid grid-cols-3 gap-4 w-full absolute" style={{
				transform: `scale(${size})`,
				minWidth: SIZE_W,
				maxWidth: SIZE_W,
				minHeight: SIZE_H,
				maxHeight: SIZE_H,
			}}>
				<CardPlaceholder position={0} isPlayer={false} />
				<CardPlaceholder position={1} isPlayer={false} />
				<CardPlaceholder position={2} isPlayer={false} />
				<CardPlaceholder position={0} isPlayer />
				<CardPlaceholder position={1} isPlayer />
				<CardPlaceholder position={2} isPlayer />
			</div>
		</div>
  );
}

function useOnWrapperResize(
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