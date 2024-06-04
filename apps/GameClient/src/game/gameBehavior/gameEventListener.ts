import { GameStore } from "../stores/gameStateStore";
import { EventType } from "./useGameEvents";

let gameEventListeners = initGameEventListeners();

export type TriggerEventType = (event: EventType) => void;

type GameEventListenerFunction = (
  e: EventType,
  data: GameStore,
  triggerEvent: (event: EventType) => void
) => void;

function initGameEventListeners() {
  return new Map<EventType["type"], GameEventListenerFunction[]>();
}

export function addGameEventListener(
  type: EventType["type"],
  action: GameEventListenerFunction,
  filter?: (event: EventType) => boolean // filter allow to listen only to specific event
) {
  let existingEvents = gameEventListeners.get(type);
  const actionComputed: GameEventListenerFunction =
    filter === undefined
      ? action
      : (e, data, triggerEvent) => filter(e) && action(e, data, triggerEvent);
  existingEvents = existingEvents
    ? [...existingEvents, actionComputed]
    : [actionComputed];
  gameEventListeners.set(type, existingEvents);
}

export function runGameEventListeners(
  type: EventType["type"],
  e: EventType,
  data: GameStore,
  triggerEvent: (event: EventType) => void
) {
  gameEventListeners.get(type)?.forEach((action: GameEventListenerFunction) => {
    action(e, data, triggerEvent);
  });
}

export function resetAllGameEventListeners() {
  gameEventListeners = initGameEventListeners();
}
