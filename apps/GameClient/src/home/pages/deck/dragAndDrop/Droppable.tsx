import { useContext, useEffect, useRef } from "react";
import { DragContext, DragContextType } from "./DragContext";

interface DroppableProps<T> {
	children: React.ReactNode;
	onDrop: (data: T) => void; 
}

export default function Droppable<T>({ children, onDrop }: DroppableProps<T>) {
	// register the drop event on context
	const { registerDroppable, removeDroppable } = useContext(DragContext) as DragContextType<T>;
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		registerDroppable({ onDrop, ref });
		return () => {
			removeDroppable(ref);
		};
	}, [ref, onDrop]);
	
	return (
		<div ref={ref}> 
			{children}
		</div>
	)
}