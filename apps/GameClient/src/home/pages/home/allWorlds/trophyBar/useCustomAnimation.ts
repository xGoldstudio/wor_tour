import { useOnUnMount } from "@repo/ui";
import { useEffect, useState } from "react";

interface UseCustomAnimationProps {
	compute: (progress: number) => void;
	ease?: (progress: number) => number;
	duration?: number;
	waitFor?: boolean;
	delay?: number;
	onStart?: () => void;
	onEnd?: () => void;
}

export default function useCustomAnimation({ compute, ease, duration, waitFor, delay, onStart, onEnd }: UseCustomAnimationProps) {
	const [hasBeenStarted, setHasBeenStarted] = useState(false);
	const [isOver, setIsOver] = useState(false);

	useEffect(() => {
		if (!waitFor || hasBeenStarted) {
			return;
		}
		setHasBeenStarted(true);
		compute(0);
		let interval: NodeJS.Timeout;
		if (delay) {
			setTimeout(() => {
				interval = startRunning();
			}, delay);
		} else {
			interval = startRunning();
		}
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [waitFor]);

	function startRunning() {
		onStart?.();
		const startAnimation = Date.now();
		const interval: NodeJS.Timeout = setInterval(() => {
			const progress = Math.min((Date.now() - startAnimation) / (duration ?? 1000), 1);
			const easedProgress = ease ? ease(progress) : progress;
			compute(easedProgress);
			if (progress >= 1 && interval) {
				onEnd?.();
				setIsOver(true);
				clearInterval(interval);
			}
		}, 10);
		return interval;
	}

	return {
		isOver,
	}
}

export function useTriggerCustomAnimation() {
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	function trigger({ compute, ease, duration, onStart, onEnd }: {
		compute: (progress: number) => void;
		ease?: (progress: number) => number;
		duration?: number;
		onStart?: () => void;
		onEnd?: () => void;
	}) {
		if (timer) {
			clearInterval(timer);
			setTimer(null);
		}
		const startAnimation = Date.now();
		compute(0);
		onStart?.();
		const interval = setInterval(() => {
			const progress = Math.min((Date.now() - startAnimation) / (duration ?? 1000), 1);
			const easedProgress = ease ? ease(progress) : progress;
			compute(easedProgress);
			if (progress >= 1) {
				onEnd?.();
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