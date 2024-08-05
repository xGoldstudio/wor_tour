import { useEffect } from "react";
import { clientLoop } from "../inject";

export default function useClientLoop(name: string, listener: (remainingFrames: number | null) => void) {
	useEffect(() => {
		const { unsubscribe, remainingFrames } = clientLoop.addListener(name, listener);
		listener(remainingFrames);
		return unsubscribe;
	}, []);
}