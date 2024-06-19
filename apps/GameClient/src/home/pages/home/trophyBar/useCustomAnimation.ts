import { useOnUnMount } from "@repo/ui";
import { useEffect, useState } from "react";

interface UseCustomAnimationProps {
	compute: (progress: number) => void;
	ease?: (progress: number) => number;
	duration?: number;
	waitFor?: boolean;
}

export default function useCustomAnimation({ compute, ease, duration, waitFor }: UseCustomAnimationProps) {
	const [hasBeenStarted, setHasBeenStarted] = useState(false);
	const [isOver, setIsOver] = useState(false);

	useEffect(() => {
		if (!waitFor || hasBeenStarted) {
			return;
		}
		setHasBeenStarted(true);
		compute(0);
		const startAnimation = Date.now();
		let interval: NodeJS.Timeout | null = setInterval(() => {
			const progress = Math.min((Date.now() - startAnimation) / (duration ?? 1000), 1);
			const easedProgress = ease ? ease(progress) : progress;
			compute(easedProgress);
			if (progress >= 1 && interval) {
				setIsOver(true);
				clearInterval(interval);
				interval = null;
			}
		}, 10)
		return () => { interval && clearInterval(interval) };
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [waitFor]);

	return {
		isOver,
	}
}

export function useTriggerCustomAnimation() {
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	function trigger({ compute, ease, duration }: {
		compute: (progress: number) => void;
		ease?: (progress: number) => number;
		duration?: number;
	}) {
		if (timer) {
			clearInterval(timer);
			setTimer(null);
		}
		const startAnimation = Date.now();
		const interval = setInterval(() => {
			const progress = Math.min((Date.now() - startAnimation) / (duration ?? 1000), 1);
			const easedProgress = ease ? ease(progress) : progress;
			compute(easedProgress);
			if (progress >= 1) {
				interval && clearInterval(interval);
				setTimer(null);
			}
		}, 10)
		setTimer(interval);
	}

	useOnUnMount(() => {
		timer && clearInterval(timer);
	});

	return trigger;
}