import useEditorStore from "@/editor/store/EditorStore";
import { CardType } from "@repo/lib";
import { runGameEventListeners, useGameSyncAnimationStore } from "@repo/ui";
import { ClockReturn, drawPlaceCard, EventType, FRAME_TIME, GameStateObject, healStateDefaultTest, initTest } from "game_engine";
import { useEffect, useState } from "react";

const dummyCard: CardType = {
	name: "Dummy",
	cost: 1,
	illustration: "string",
	worldIllustration: "string",
	dmg: 0,
	hp: 200,
	attackSpeed: 0.5,
	states: [healStateDefaultTest],
	level: 1,
	world: 1,
	rarity: "common",
	id: 0,
};

function useDummyCard() {
	const cardIllustartion = useEditorStore(
		(state) => state.cards[21]?.stats[2].illustration
	);
	const worldIllustration = useEditorStore(
		(state) => state.worlds[1].cardBackground
	);
	dummyCard.illustration = cardIllustartion ?? "";
	dummyCard.worldIllustration = worldIllustration ?? "";
	return dummyCard;
}

export function useRunInstance(log: boolean) {
	const card = useDummyCard();
	const { triggerGameSyncAnimation } = useGameSyncAnimationStore();
	const [instance, setInstance] = useState<{
		state: GameStateObject;
		clock: ClockReturn<EventType>;
		play: () => void;
		pause: () => void;
		setSpeed: (speed: number) => void;
		speed: number;
		isPlaying: boolean;
		runTicks: (tickToDo: number) => void;
	} | null>(null);
	useEffect(() => {
		const { clock, state } = initTest({
			sideEffectOnFrame: ({ event, state, clock }) => {
				log && console.log(event);
				runGameEventListeners(
					event.type,
					event,
					state,
					clock.triggerEvent,
					clock
				);
			},
			playerDeck: [card],
		});
		defaultActions(clock);
		function playTick(shouldAnimate: boolean) {
			if (shouldAnimate) {
				triggerGameSyncAnimation(
					state,
					clock.getImmutableInternalState().currentFrame
				);
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
		const loopState = tickLoop(playTick)
		const play = () => operation(loopState.play);
		const pause = () => operation(loopState.pause);
		const setSpeed = (speed: number) => operation(() => loopState.setSpeed(speed));
		const operation = (fn: () => void) => {
			fn();
			updateInstance();
		}
		const updateInstance = () => setInstance({
			clock, state,  ...loopState, play, pause, setSpeed, runTicks,
		});
		updateInstance();
		play();
		return (() => pause());
	}, []);

	return instance;
}

export function defaultActions(clock?: ClockReturn<EventType>) {
	if (!clock) return;
	drawPlaceCard(clock, true, 0);
}

function tickLoop(triggerTickEffects: (shouldAnimate: boolean) => void) {
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
		state.speed = 1/newSpeed;
		play();
	}

	return state;
}