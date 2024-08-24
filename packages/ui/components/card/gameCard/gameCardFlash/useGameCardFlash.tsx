import { useRef } from "react";
import { useSyncGameAnimation } from "../../useGameSyncAnimation";
import { animationTimeline } from "@repo/lib";

export default function useGameCardFlash() {
	const flashRef = useRef<HTMLDivElement>(null);
	const { triggerAnimation, removeAnimation } = useSyncGameAnimation();

	function triggerFlash() {
		if (!flashRef.current) return;
		triggerAnimation({
			replace: true,
			duration: 50,
			computeStyle: flash(
				flashRef.current
			),
		});
	}

	function flash(element: HTMLElement | null) {
    return (
      animationTimeline(50)
        // y is the current translation y of the ref
        .add(
          element,
          {
            opacity: 0,
          },
          [
            { values: { opacity: 60 }, to: 20, ease: [0, 0.42, 1, 1] },
            { values: { opacity: 0 }, ease: [0, 0.42, 1, 1] },
          ]
        ).progress
    );
  }

	function clear() {
		if (!flashRef.current) return;
		flashRef.current.style.opacity = "0";
		removeAnimation();
	}

	return {
		triggerFlash,
		flashRef,
		clear,
	}
}