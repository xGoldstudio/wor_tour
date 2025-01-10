import DebugIndex from "@/editor/ui/DebugIndex";
import GameTimerDebug from "./GameTimerDebug";
import HandCardDebug from "./HandCardDebug";
import InGameCardDebug from "./InGameCardDebug";
import ManaBarDebug from "./ManaBarDebug";
import StateHistoryDebug from "./StateHistoryDebug";
import StatesDescDebug from "./StatesDescDebug";

export const DebugGameComponents: [string, React.FunctionComponent][] = [
	["Card", InGameCardDebug],
	["Mana", ManaBarDebug],
	["Timer", GameTimerDebug],
	["Hand_Card", HandCardDebug],
	["State_History", StateHistoryDebug],
	["State_Desc", StatesDescDebug],
];

export default function DebugGameComponentsIndex() {
	return <DebugIndex components={DebugGameComponents} title={"Debug Game Components"} />;
}