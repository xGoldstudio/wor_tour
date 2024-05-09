
export const FRAME_TIME = 1000;

interface FrameObject {
	frame: number;
	events: (() => void)[];
}

export default function Clock<EventType>(onTriggerEvent: (e: EventType) => void) {
	let timeoutQueue: FrameObject[] = [];
	let isRunningEvent = false;
	let currentFrame = 0;

	function getCurrentFrameObject(): FrameObject | null {
		return timeoutQueue.length >= 1 && timeoutQueue[0].frame === currentFrame
			? timeoutQueue[0]
			: null;
	}

	function setGameEventTimeout(
		event: EventType,
		timeoutFrame: number
	) {
		if (timeoutFrame < 0) {
			console.warn("timeoutFrame must be positive");
			return;
		}
		const targetFrame = currentFrame + timeoutFrame;
		for (let i = 0; i < timeoutQueue.length; i++) {
			// case 1, match
			if (timeoutQueue[i].frame === targetFrame) {
				timeoutQueue[i].events.push(() => onTriggerEvent(event));
				console.log("a")
				break;
			} else if (
				i + 1 < currentFrame &&
				targetFrame < timeoutQueue[i + 1].frame
			) {
				// case 2, frame in between two frames
				timeoutQueue.splice(i + 1, 0, {
					frame: targetFrame,
					events: [() => onTriggerEvent(event)],
				});
				console.log("b")

				break;
			} else {
				// mean we reach the end
				timeoutQueue.push({
					frame: targetFrame,
					events: [() => onTriggerEvent(event)],
				});
				console.log("c")

				break;
			}
		}
	}

	function addEventToNextFrame(event: EventType) {
		const currentFrameObject = getCurrentFrameObject();
		if (currentFrameObject) {
			currentFrameObject.events.push(() => onTriggerEvent(event));
		} else {
			timeoutQueue = [
				{ frame: currentFrame, events: [() => onTriggerEvent(event)] },
				...timeoutQueue,
			];
		}
	}

	function nextTick() {
		console.log(currentFrame, {...timeoutQueue});
		isRunningEvent = true;
		const currentFrameObject = getCurrentFrameObject();
		if (currentFrameObject) {
			currentFrameObject.events.forEach((event) => event()); // still running in sync of order calling
			timeoutQueue = timeoutQueue.slice(1); // remove current event
		}
		console.log("====>", currentFrame, {...timeoutQueue});
		isRunningEvent = false;
		currentFrame = currentFrame + 1;
	}

	function triggerEvent(event: EventType) {
		isRunningEvent ? onTriggerEvent(event) : addEventToNextFrame(event);
	}

	return {
		triggerEvent,
		getCurrentFrameObject,
		setGameEventTimeout,
		addEventToNextFrame,
		nextTick,
		timeoutQueue,
		isRunningEvent,
		currentFrame
	}
}