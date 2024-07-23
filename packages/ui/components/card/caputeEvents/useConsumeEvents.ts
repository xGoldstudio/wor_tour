import { EventType, GameStateObject } from "game_engine";
import { useContext, useEffect } from "react";
import { CaptureEventsContext, CaptureEventsContextType } from "./CaptureEvents";

export default function useConsumeEvents(
  consumer: (event: EventType, state: GameStateObject) => true | null
) {
  const { consumeEvents } = useContext(
    CaptureEventsContext
  ) as CaptureEventsContextType;

  useEffect(() => {
    const cleaner = consumeEvents(consumer);
    return cleaner;
  }, []);
}
