import DebugIndex from "@/editor/ui/DebugIndex";
import ButtonDebug from "./ButtonDebug";

export const DebugComponents: [string, React.FunctionComponent][] = [
	["Button", ButtonDebug],
];

export default function DebugComponentsIndex() {
	return <DebugIndex components={DebugComponents} title={"Debug Ui Components"} />;
}