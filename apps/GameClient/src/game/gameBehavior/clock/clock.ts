import * as _ from "lodash";

interface FrameObject {
  frame: number;
  events: (() => void)[];
}

export interface ClockReturn<EventType> {
  triggerEvent: (event: EventType) => void;
  getCurrentFrameObject: () => FrameObject | null;
  setGameEventTimeout: (event: EventType, timeoutFrame: number) => void;
  addEventToNextFrame: (event: EventType) => void;
  nextTick: () => void;
  getImmutableInternalState: () => {
    currentFrame: number;
    isRunningEvent: boolean;
    timeoutQueue: FrameObject[];
  };
}

export default function Clock<EventType>(
  onTriggerEvent: (e: EventType) => void,
): ClockReturn<EventType> {
  let timeoutQueue: FrameObject[] = [];
  let isRunningEvent = false;
  let currentFrame = 0;

  function getCurrentFrameObject(): FrameObject | null {
    return timeoutQueue.length >= 1 && timeoutQueue[0].frame === currentFrame
      ? timeoutQueue[0]
      : null;
  }

  function setGameEventTimeout(event: EventType, timeoutFrame: number) {
    const usingFrame = Math.round(timeoutFrame);
    if (usingFrame < 0) {
      console.warn("timeoutFrame must be positive");
      return;
    }
    const targetFrame = currentFrame + usingFrame;
    for (let i = 0; i < timeoutQueue.length; i++) {
      if (timeoutQueue[i].frame === targetFrame) {
        timeoutQueue[i].events.push(() => onTriggerEvent(event));
        return;
      } else if (
        i + 1 < timeoutQueue.length &&
        targetFrame < timeoutQueue[i + 1].frame
      ) {
        // case 2, frame in between two frames
        timeoutQueue.splice(i + 1, 0, {
          frame: targetFrame,
          events: [() => onTriggerEvent(event)],
        });
        return;
      }
    }
    // the element should happened at the end of the list anyway
    timeoutQueue.push({
      frame: targetFrame,
      events: [() => onTriggerEvent(event)],
    });
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
    isRunningEvent = true;
    const currentFrameObject = getCurrentFrameObject();
    if (currentFrameObject) {
      currentFrameObject.events.forEach((event) => event()); // still running in sync of order calling
      timeoutQueue = timeoutQueue.slice(1); // remove current event
    }
    isRunningEvent = false;
    currentFrame = currentFrame + 1;
  }

  function triggerEvent(event: EventType) {
    isRunningEvent ? onTriggerEvent(event) : addEventToNextFrame(event);
  }

  function getImmutableInternalState() {
    return {
      currentFrame,
      isRunningEvent,
      timeoutQueue: _.cloneDeep(timeoutQueue),
    };
  }

  return {
    triggerEvent,
    getCurrentFrameObject,
    setGameEventTimeout,
    addEventToNextFrame,
    nextTick,
    getImmutableInternalState,
  };
}
