import { FpsTrackerType, resetAllGameEventListeners, runGameEventListeners, useGameSyncAnimationStore, useOnMount, useOnUnMount } from "@repo/ui";
import { ClockReturn, EventType, FRAME_TIME, GameStateObject, GameStateObjectConstructor, initTest } from "game_engine";
import { useRef, useState } from "react";

export type UseRunInstance = {
	state: GameStateObject;
	clock: ClockReturn<EventType>;
	play: () => void;
	pause: () => void;
	setSpeed: (speed: number) => void;
	speed: number;
	isPlaying: boolean;
	runTicks: (tickToDo: number) => void;
};

export function useRunInstance({
	animationsCompute, fpsTracker, gameData,
}: {
	animationsCompute?: (currentFrame: number) => Promise<void>,
	fpsTracker?: FpsTrackerType,
	gameData?: GameStateObjectConstructor,
}): UseRunInstance {
	const { triggerGameSyncAnimation, reset: resetGameSyncAnimationStore } = useGameSyncAnimationStore();
	const [instance, setInstance] = useState<UseRunInstance>(runInstance());
	const isGameOverRef = useRef(false);

	function runInstance() {
		const { clock, state } = initTest({
			sideEffectOnEvent: ({ event, state, clock }) => {
				if (event.type === "gameOver") {
					isGameOverRef.current = true;
				}
				runGameEventListeners(
					event.type,
					event,
					state,
					clock.triggerEvent,
					clock
				);
			},
			gameData,
		});
		async function playTick(shouldAnimate: boolean) {
			if (isGameOverRef.current) return;
			if (shouldAnimate) {
				triggerGameSyncAnimation(
					state,
					clock.getImmutableInternalState().currentFrame
				);
				await animationsCompute?.(clock.getImmutableInternalState().currentFrame);
			}
			clock.nextTick();
		}
		function runTicks(tickToDo: number) {
			if (tickToDo < 1) return;
			for (let i = 0; i < (tickToDo - 1); i++) {
				playTick(false);
			}
			playTick(true);
		}
		const loopState = tickLoop(playTick, fpsTracker)
		const play = () => operation(loopState.play);
		const pause = () => operation(loopState.pause);
		const setSpeed = (speed: number) => operation(() => loopState.setSpeed(speed));
		const operation = (fn: () => void) => {
			fn();
			setInstance(getInstance);
		}
		const getInstance = () => ({
			clock,
			state,
			isPlaying: loopState.isPlaying,
			speed: loopState.speed,
			play,
			pause,
			setSpeed,
			runTicks
		});
		return getInstance();
	}

	useOnMount(() => {
		instance.play();
	})

	useOnUnMount(() => {
		instance.pause();
		resetAllGameEventListeners();
		resetGameSyncAnimationStore();
	});

	return instance;
}

function tickLoop(triggerTickEffects: (shouldAnimate: boolean) => void, fpsTracker?: FpsTrackerType) {
	let lastTickTiming = <number | null>(null);
	const state = {
		isPlaying: false,
		speed: 1,
		play,
		pause,
		setSpeed,
	}

	function nextTick() {
		window.requestAnimationFrame(async () => {
			if (!state.isPlaying) return;
			const now = Date.now();
			const prev = lastTickTiming ?? now;

			const timeSinceLastTick = now - prev;
			const tickToDo = Math.floor(timeSinceLastTick / (FRAME_TIME * state.speed));
			lastTickTiming = prev + tickToDo * (FRAME_TIME * state.speed);
			if (tickToDo > 0) {
				triggerTickEffects(true);
				for (let i = 1; i < tickToDo; i++) {
					triggerTickEffects(false);
				}
			}
			fpsTracker?.register(timeSinceLastTick);
			nextTick();
		});
	}

	function play() {
		if (state.isPlaying) return;
		lastTickTiming = Date.now();
		state.isPlaying = true;
		nextTick();
	}

	function pause() {
		state.isPlaying = false;
	}

	function setSpeed(newSpeed: number) {
		state.speed = 1 / newSpeed;
		play();
	}

	return state;
}