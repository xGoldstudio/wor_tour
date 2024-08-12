import { useEffect } from "react";
import { GameEventListenerFunction, addGameEventListener } from "./gameEventListener";
import { EventType } from "game_engine";

interface UseGameEventListenerProps<E extends EventType> {
	type: E["type"] | null,
	action: GameEventListenerFunction<E>,
	filter?: (event: E) => boolean,
	deps?: React.DependencyList;
}

export default function useGameEventListener<E extends EventType>({
	type,
	action,
	filter,
	deps,
}: UseGameEventListenerProps<E>) {
	useEffect(() => {
		return addGameEventListener<E>(type, action, filter);
	}, deps ?? []);
}