import GameTimerDebug from "./GameTimerDebug";
import HandCardDebug from "./HandCardDebug";
import InGameCardDebug from "./InGameCardDebug";
import ManaBarDebug from "./ManaBarDebug";

export const DebugComponents: [string, React.FunctionComponent][] = [
	["Card", InGameCardDebug],
	["Mana", ManaBarDebug],
	["Timer", GameTimerDebug],
	["Hand_Card", HandCardDebug],
];
