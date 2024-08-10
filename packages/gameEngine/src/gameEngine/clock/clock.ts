import * as _ from "lodash";

interface FrameObject<EventType> {
  frame: number;
  events: EventType[];
}

export interface ClockReturn<EventType> {
  triggerEvent: (event: EventType) => void;
  getCurrentFrameObject: () => FrameObject<EventType> | null;
  setGameEventTimeout: (event: EventType, timeoutFrame: number) => void;
  removeGameEventTimeout: (event: Partial<EventType>, timeoutFrame: number) => number;
  addEventToNextFrame: (event: EventType) => void;
  nextTick: () => void;
  getImmutableInternalState: () => {
    currentFrame: number;
    isRunningEvent: boolean;
    timeoutQueue: readonly FrameObject<EventType>[];
    history: readonly FrameObject<EventType>[];
  };
  getLastTickEvents: () => EventType[];
}

export default function Clock<EventType>(
  onTriggerEvent: (e: EventType, clock: ClockReturn<EventType>) => void
): ClockReturn<EventType> {

  let timeoutQueue: FrameObject<EventType>[] = [];
  const history: FrameObject<EventType>[] = [];
  let isRunningEvent = false;
  let currentFrame = 0;

  const state = {
    triggerEvent,
    getCurrentFrameObject,
    setGameEventTimeout,
    removeGameEventTimeout,
    addEventToNextFrame,
    nextTick,
    getImmutableInternalState,
    getLastTickEvents,
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

  function removeGameEventTimeout(event: Partial<EventType>, timeoutFrame: number) {
    const usingFrame = Math.round(timeoutFrame);
    if (usingFrame < 0) {
      console.warn("timeoutFrame must be positive");
      return 0;
    }
    for (let i = 0; i < timeoutQueue.length; i++) {
      if (timeoutQueue[i].frame === timeoutFrame) {
        const previousSize = timeoutQueue[i].events.length;
        timeoutQueue[i].events = timeoutQueue[i].events.filter(
          (e) => !partialVerify(e, event)
        );
        return previousSize - timeoutQueue[i].events.length;
      }
    }
    return 0;
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
      addEventToHistory(event);
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
      history: Object.freeze([...history]),
    };
  }

  function addEventToHistory(event: EventType) {
    const current = history.length > 0 ? history[history.length - 1] : null;
    if (current && current.frame === currentFrame) {
      current.events.push(event);
      return;
    }
    history.push({ frame: currentFrame, events: [event] });
  }

  function getLastTickEvents() {
    return (history[history.length - 1])?.events ?? [];
  }

  return state;
}

function partialVerify<T>(obj: T, partial: Partial<T>): boolean {
  for (const key in partial) {
    if (obj[key] !== partial[key]) {
      return false;
    }
  }
  return true;
}