import * as _ from "lodash";

interface FrameObject<EventType> {
  frame: number;
  events: EventType[];
}

export interface ClockReturn<EventType> {
  triggerEvent: (event: EventType) => void;
  getCurrentFrameObject: () => FrameObject<EventType> | null;
  setGameEventTimeout: (event: EventType, timeoutFrame: number) => void;
  addEventToNextFrame: (event: EventType) => void;
  nextTick: () => void;
  getImmutableInternalState: () => {
    currentFrame: number;
    isRunningEvent: boolean;
    timeoutQueue: FrameObject<EventType>[];
  };
}

export default function Clock<EventType>(
  onTriggerEvent: (e: EventType, clock: ClockReturn<EventType>) => void
): ClockReturn<EventType> {

  let timeoutQueue: FrameObject<EventType>[] = [];
  let isRunningEvent = false;
  let currentFrame = 0;

  const state = {
    triggerEvent,
    getCurrentFrameObject,
    setGameEventTimeout,
    addEventToNextFrame,
    nextTick,
    getImmutableInternalState,
  };

  function getCurrentFrameObject(): FrameObject<EventType> | null {
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
        timeoutQueue[i].events.push(event);
        return;
      } else if (
        i + 1 < timeoutQueue.length &&
        targetFrame < timeoutQueue[i + 1].frame
      ) {
        // case 2, frame in between two frames
        timeoutQueue.splice(i + 1, 0, {
          frame: targetFrame,
          events: [event],
        });
        return;
      }
    }
    // the element should happened at the end of the list anyway
    timeoutQueue.push({
      frame: targetFrame,
      events: [event],
    });
  }

  function addEventToNextFrame(event: EventType) {
    const currentFrameObject = getCurrentFrameObject();
    if (currentFrameObject) {
      currentFrameObject.events.push(event);
    } else {
      timeoutQueue = [
        { frame: currentFrame, events: [event] },
        ...timeoutQueue,
      ];
    }
  }

  let nextEventQueue: EventType[] = [];

  function addEventToCurrentFrame(event: EventType) {
    nextEventQueue.push(event);
  }
  
  function runAllEventsSync(event: EventType) {
    nextEventQueue = [event];
    while (nextEventQueue.length > 0) {
      const event = nextEventQueue[0];
      nextEventQueue = nextEventQueue.slice(1);
      onTriggerEvent(event, state);
    }
  }

  function nextTick() {
    isRunningEvent = true;
    const currentFrameObject = getCurrentFrameObject();
    if (currentFrameObject) {
      currentFrameObject.events.forEach(runAllEventsSync); // still running in sync of order calling
      timeoutQueue = timeoutQueue.slice(1); // remove current event
    }
    isRunningEvent = false;
    currentFrame = currentFrame + 1;
  }

  // it means the event will be fully completed before the parent end
  function triggerEvent(event: EventType) {
    isRunningEvent ? addEventToCurrentFrame(event) : addEventToNextFrame(event);
  }

  function getImmutableInternalState() {
    return {
      currentFrame,
      isRunningEvent,
      timeoutQueue: _.cloneDeep(timeoutQueue),
    };
  }

  return state;
}
