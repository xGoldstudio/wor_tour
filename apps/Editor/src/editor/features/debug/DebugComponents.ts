import GameTimerDebug from "./GameTimerDebug";
import HandCardDebug from "./HandCardDebug";
import InGameCardDebug from "./InGameCardDebug";
import ManaBarDebug from "./ManaBarDebug";
import StateHistoryDebug from "./StateHistoryDebug";

export const DebugComponents: [string, React.FunctionComponent][] = [
	["Card", InGameCardDebug],
	["Mana", ManaBarDebug],
	["Timer", GameTimerDebug],
	["Hand_Card", HandCardDebug],
	["State_History", StateHistoryDebug],
];
