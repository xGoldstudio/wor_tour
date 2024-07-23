import { ClockReturn, EventType, GameStateObject } from "game_engine";

let gameEventListeners = initGameEventListeners();

export type TriggerEventType = (event: EventType) => void;

export type GameEventListenerFunction = (
  e: EventType,
  data: GameStateObject,
  triggerEvent: (event: EventType) => void,
  clock: ClockReturn<EventType>, 
) => void;

function initGameEventListeners() {
  return new Map<EventType["type"] | null, GameEventListenerFunction[]>();
}

export function addGameEventListener(
  type: EventType["type"] | null, // null is a wildcard
  action: GameEventListenerFunction,
  filter?: (event: EventType) => boolean // filter allow to listen only to specific event
) {
  let existingEvents = gameEventListeners.get(type);
  const actionComputed: GameEventListenerFunction =
    filter === undefined
      ? action
      : (e, data, triggerEvent, clock) => filter(e) && action(e, data, triggerEvent, clock);
  existingEvents = existingEvents
    ? [...existingEvents, actionComputed]
    : [actionComputed];
  gameEventListeners.set(type, existingEvents);
  return () => removeGameEventListener(type, actionComputed);
}

export function removeGameEventListener(
  type: EventType["type"] | null,
  action: GameEventListenerFunction,
) {
  const existingEvents = gameEventListeners.get(type);
  if (existingEvents) {
    const newEvents = existingEvents.filter((e) => e !== action);
    if (newEvents.length === 0) {
      gameEventListeners.delete(type);
    } else {
      gameEventListeners.set(type, newEvents);
    }
  }
}

export function runGameEventListeners(
  type: EventType["type"],
  e: EventType,
  data: GameStateObject,
  triggerEvent: (event: EventType) => void,
  clock: ClockReturn<EventType>,
) {
  gameEventListeners.get(type)?.forEach((action: GameEventListenerFunction) => {
    action(e, data, triggerEvent, clock);
  });
  // (null is a wildcard, so run on every event)
  gameEventListeners.get(null)?.forEach((action: GameEventListenerFunction) => {
    action(e, data, triggerEvent, clock);
  });
}

export function resetAllGameEventListeners() {
  gameEventListeners = initGameEventListeners();
}
