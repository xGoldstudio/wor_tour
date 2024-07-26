import { IS_DEBUG } from "@/isDebug";
import { callbackService } from "../CallbackService/callbackService";

const clientLoopDataFromLocalStorage = JSON.parse(localStorage.getItem('clientLoop') || '{}') as Partial<ClientLoopData>;

type ClientLoopData = {
	timersMap: Record<string, { remainingFrames: number, callbackName: string, cycleDuration: number | null }>,
	lastTimestamp: number,
};

const FRAME_DURATION = 1000;

function getFirstTimeOfDay() {
	return new Date().setHours(0, 0, 0, 0);
}

function getRemainFramesFromCurrentCycle(elapsedFramesFromLastCycle: number, timeout: number) {
	return timeout - elapsedFramesFromLastCycle % timeout;
}

function ClientLoop() {
	const timersMap: Record<string, { remainingFrames: number, callbackName: string, cycleDuration: number | null }>
		= clientLoopDataFromLocalStorage.timersMap || {};
	const listenersMap: Record<string, { listeners: ((remainingFrames: number | null) => void)[] }>
		= {};
	let lastTimestamp = clientLoopDataFromLocalStorage.lastTimestamp || Date.now();

	function cycle(name: string, callbackName: string, timeout: number) { // cycle should be called once in a account lifetime
		const firstTimeOfDay = getFirstTimeOfDay();
		const remainFramesFromCurrentCycle = getRemainFramesFromCurrentCycle(
			Math.floor((Date.now() - firstTimeOfDay) / FRAME_DURATION),
			timeout,
		);
		callbackService.call(callbackName); // initial call
		pushTimer(
			name,
			callbackName,
			remainFramesFromCurrentCycle,
			timeout,
		);
	}

	function pushTimer(name: string, callbackName: string, timeout: number, cycleDuration: number | null = null) {
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
	}

	function _unsafeManipulateClock(framesToAdd: number) {
		if (!IS_DEBUG) return;
		lastTimestamp = lastTimestamp - framesToAdd * FRAME_DURATION;
	}

	return {
		cycle,
		pushTimer,
		start: startInterval,
		addListener,
		reset,
		_unsafeManipulateClock,
	};
}

const clientLoop = ClientLoop();
clientLoop.start();

export default clientLoop;