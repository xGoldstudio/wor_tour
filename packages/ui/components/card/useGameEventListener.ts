import { useEffect } from "react";
import { GameEventListenerFunction, addGameEventListener } from "./gameEventListener";
import { EventType } from "game_engine";

interface UseGameEventListenerProps {
	type: EventType["type"],
	action: GameEventListenerFunction,
	filter?: (event: EventType) => boolean,
	deps?: React.DependencyList;
}

export default function useGameEventListener({
	type,
	action,
	filter,
	deps,
}: UseGameEventListenerProps) {
	useEffect(() => {
		return addGameEventListener(type, action, filter);
	}, deps ?? []);
}