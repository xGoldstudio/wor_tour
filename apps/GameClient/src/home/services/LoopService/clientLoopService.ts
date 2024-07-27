import { IS_DEBUG } from "@/isDebug";
import { callbackService, CallbackServiceName } from "../CallbackService/callbackService";
import { getSecondsFromDays } from "@repo/lib";
import { CARDS_ROTATION_TIME } from "@/home/store/shopStore/shopStore";


type ClientLoopData = {
	timersMap: Record<string, { remainingFrames: number, callbackName: CallbackServiceName, cycleDuration: number | null }>,
	lastTimestamp: number,
};

const FRAME_DURATION = 1000;

function getFirstTimeOfDay() {
	return new Date().setHours(0, 0, 0, 0);
}

function getRemainFramesFromCurrentCycle(elapsedFramesFromLastCycle: number, timeout: number) {
	return timeout - elapsedFramesFromLastCycle % timeout;
}

interface CycleProps {
	name: string;
	callbackName: CallbackServiceName;
	duration: number;
}

interface Timer { remainingFrames: number, callbackName: CallbackServiceName, cycleDuration: number | null }

function ClientLoop(cycles: CycleProps[]) {
	const clientLoopDataFromLocalStorage = JSON.parse(localStorage.getItem('clientLoop') || '{}') as Partial<ClientLoopData>;
	const timersMap: Record<string, Timer> = clientLoopDataFromLocalStorage.timersMap || {};
	const listenersMap: Record<string, { listeners: ((remainingFrames: number | null) => void)[] }>
		= {};
	let lastTimestamp = clientLoopDataFromLocalStorage.lastTimestamp || Date.now();
	init();

	function init() {
		cycles.forEach(cycle);
	}

	function cycle({ name, callbackName, duration }: CycleProps) {
		if (timersMap[name]) {
			return;
		}
		callbackService.call(callbackName);
		const firstTimeOfDay = getFirstTimeOfDay();
		const remainFramesFromCurrentCycle = getRemainFramesFromCurrentCycle(
			Math.floor((Date.now() - firstTimeOfDay) / FRAME_DURATION),
			duration,
		);
		pushTimer(
			name,
			callbackName,
			remainFramesFromCurrentCycle,
			duration,
		);
	}

	function pushTimer(name: string, callbackName: CallbackServiceName, timeout: number, cycleDuration: number | null = null) {
		timersMap[name] = {
			remainingFrames: timeout,
			callbackName,
			cycleDuration,
		};
		saveState();
	}

	function loop() {
		const now = Date.now();
		const delta = now - lastTimestamp;
		const framesToAdd = Math.floor(delta / FRAME_DURATION);
		lastTimestamp = lastTimestamp + framesToAdd * FRAME_DURATION;

		Object.keys(timersMap).forEach((timerName) => {
			const timer = timersMap[timerName];
			timer.remainingFrames -= framesToAdd;
			if (timer.remainingFrames <= 0) {
				if (timer.cycleDuration !== null) {
					timer.remainingFrames = getRemainFramesFromCurrentCycle(
						-timer.remainingFrames,
						timer.cycleDuration,
					);
				} else {
					delete timersMap[timerName];
				}
				callbackService.call(timer.callbackName);
			}
		});

		notifiyAllListeners();
		saveState();
	}

	function notifiyAllListeners() {
		Object.keys(timersMap).forEach((timerName) => {
			listenersMap[timerName]?.listeners.forEach((listener) => listener(
				timersMap[timerName]?.remainingFrames ?? null
			));
		});
	}

	function addListener(name: string, listener: (remainingFrames: number | null) => void) {
		if (!listenersMap[name]) {
			listenersMap[name] = { listeners: [] };
		}
		listenersMap[name].listeners.push(listener);
		return {
			unsubscribe: () => {
				listenersMap[name].listeners = listenersMap[name].listeners.filter((l) => l !== listener);
			},
			remainingFrames: timersMap[name]?.remainingFrames ?? null,
		}
	}

	function startInterval() {
		setInterval(() => {
			loop();
		}, FRAME_DURATION);
		loop();
	}

	function saveState() {
		localStorage.setItem('clientLoop', JSON.stringify({
			timersMap,
			lastTimestamp,
		}));
	}

	function reset() {
		localStorage.setItem('clientLoop', '{}');
		lastTimestamp = Date.now();
		Object.keys(timersMap).forEach((timerName) => {
			delete timersMap[timerName];
		});
		init();
	}

	function _unsafeManipulateClock(framesToAdd: number) {
		if (!IS_DEBUG) return;
		lastTimestamp = lastTimestamp - framesToAdd * FRAME_DURATION;
	}

	return {
		pushTimer,
		start: startInterval,
		addListener,
		reset,
		_unsafeManipulateClock,
	};
}

const clientLoop = ClientLoop([
	{ name: "cardRotationShop", callbackName: "setCardsToBuy", duration: CARDS_ROTATION_TIME },
	{ name: "dailyGold", callbackName: "resetDailyGold", duration: getSecondsFromDays(1) }
]);
clientLoop.start();

export default clientLoop;