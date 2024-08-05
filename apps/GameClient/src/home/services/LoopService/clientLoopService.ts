import { IS_DEBUG } from "@/isDebug";
import { callbackService, CallbackServiceName } from "../inject";

type ClientLoopData = {
	timersMap: Record<string, Timer>,
	lastTimestamp: number,
};

const FRAME_DURATION = 1000;

function getFirstTimeOfDay() {
	return new Date().setHours(0, 0, 0, 0);
}

function getRemainFramesFromCurrentCycle(elapsedFramesFromLastCycle: number, timeout: number) {
	const remainingFrames = timeout - elapsedFramesFromLastCycle % timeout;
	const numberOfCycles = Math.floor(elapsedFramesFromLastCycle / timeout);
	return {
		remainingFrames: remainingFrames,
		numberOfCycles: numberOfCycles,
	};
}

interface CycleProps {
	name: string;
	callbackName: CallbackServiceName;
	duration: number;
	triggerMany?: boolean;
}

interface Timer {
	remainingFrames: number,
	callbackName: CallbackServiceName,
	cycleDuration: number | null,
	triggerMany: boolean,
}

export function ClientLoop(cycles: CycleProps[]) {
	const clientLoopDataFromLocalStorage = JSON.parse(localStorage.getItem('clientLoop') || '{}') as Partial<ClientLoopData>;
	const timersMap: Record<string, Timer> = clientLoopDataFromLocalStorage.timersMap || {};
	const listenersMap: Record<string, { listeners: ((remainingFrames: number | null) => void)[] }>
		= {};
	let lastTimestamp = clientLoopDataFromLocalStorage.lastTimestamp || Date.now();
	init();

	function init() {
		cycles.forEach(cycle);
	}

	function cycle({ name, callbackName, duration, triggerMany }: CycleProps) {
		if (timersMap[name]) {
			return;
		}
		callbackService.call(callbackName);
		const firstTimeOfDay = getFirstTimeOfDay();
		const { remainingFrames } = getRemainFramesFromCurrentCycle(
			Math.floor((Date.now() - firstTimeOfDay) / FRAME_DURATION),
			duration,
		);
		pushTimer(
			name,
			callbackName,
			remainingFrames,
			duration,
			triggerMany || false,
			false,
		);
	}

	function pushTimer(
		name: string,
		callbackName: CallbackServiceName,
		timeout: number,
		cycleDuration: number | null = null,
		triggerMany: boolean,
		replace: boolean,
	) {
		if (!replace && timersMap[name]) {
			return;
		}
		timersMap[name] = {
			remainingFrames: timeout,
			callbackName,
			cycleDuration,
			triggerMany,
		};
		saveState();
	}

	function removeTimer(name: string) {
		delete timersMap[name];
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
					const { remainingFrames, numberOfCycles } = getRemainFramesFromCurrentCycle(
						-timer.remainingFrames,
						timer.cycleDuration,
					);
					if (timer.triggerMany) {
						let i = 0;
						while (i < (numberOfCycles + 1) && timersMap[timerName]) { // timer could have be removed between two cycles
							callbackService.call(timer.callbackName);
							i++;
						}
						if (!timersMap[timerName]) {
							notifyDeletedTimer(timerName);
							return;
						}
					} else {
						callbackService.call(timer.callbackName);
					}
					timer.remainingFrames = remainingFrames;
				} else {
					notifyDeletedTimer(timerName);
					callbackService.call(timer.callbackName);
					delete timersMap[timerName];
					return;
				}
			}
		});

		notifiyAllListeners();
		saveState();
	}

	function notifyDeletedTimer(timerName: string) {
		listenersMap[timerName]?.listeners.forEach((listener) => listener(null));
	}

	function notifiyAllListeners() {
		Object.keys(timersMap).forEach(notifyListeners);
	}

	function notifyListeners(name: string) {
		listenersMap[name]?.listeners.forEach((listener) => listener(
			timersMap[name]?.remainingFrames ?? null
		));
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
		removeTimer,
		start: startInterval,
		addListener,
		reset,
		cycle,
		_unsafeManipulateClock,
	};
}
