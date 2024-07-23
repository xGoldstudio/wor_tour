import { EventType, GameStateObject } from "game_engine";
import useGameEventListener from "../useGameEventListener";
import { useEffect, useRef } from "react";
import { uniqueId } from "lodash";

type Watcher = (event: EventType, state: GameStateObject) => true | null;

export default function useCatpureEvents({
  watcher,
}: {
  watcher: (event: EventType, state: GameStateObject) => true | null;
}) {
	// event if state is stored directly when event is trigger, we store a reference to it, the state
	// could have been changed by the time the consumer consume the event
  const events = useRef<{ event: EventType; state: GameStateObject }[]>([]);
  const watchers = useRef(
    new Map<string, (event: EventType, state: GameStateObject) => true | null>()
  );

  useGameEventListener({
    type: null,
    action: (event, state) => {
      if (watcher(event, state) === null) return;
      events.current = [...events.current, { event, state }];
      watchers.current.forEach(internalConsumeEvents);
    },
  });

	// @Important: all events are consumed at once to guarante event order
  function consumeEvents(consumer: Watcher) {
    internalConsumeEvents(consumer);
    const key = uniqueId();
    watchers.current.set(key, consumer);
    return () => watchers.current.delete(key);
  }

  function internalConsumeEvents(consumer: Watcher) {
    events.current = events.current.filter(
      (event) => consumer(event.event, event.state) === null
    );
  }

  return {
    consumeEvents: consumeEvents,
  };
}

export function useConsumeEvents(
  consumeEvents: (
    consumer: (event: EventType, state: GameStateObject) => true | null
  ) => () => void,
  consumer: (event: EventType, state: GameStateObject) => true | null
) {
  useEffect(() => {
    const cleaner = consumeEvents(consumer);
    return cleaner;
  }, []);
}
