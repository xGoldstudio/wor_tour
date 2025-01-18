import DebugIndex from "@/editor/ui/DebugIndex";
import ButtonDebug from "./ButtonDebug";
import PopoverDebug from "./PopoverDebug";

export const DebugComponents: [string, React.FunctionComponent][] = [
	["Button", ButtonDebug],
	["Popover", PopoverDebug],
];

export default function DebugComponentsIndex() {
	return <DebugIndex components={DebugComponents} title={"Debug Ui Components"} />;
}