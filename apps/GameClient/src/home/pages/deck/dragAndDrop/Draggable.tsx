import React, { useContext, useEffect, useRef } from "react";
import { DragContext, DragContextType } from "./DragContext";

interface DraggableProps<T> {
  children: React.ReactNode;
  disabled?: boolean;
  dragData: T;
  dragRef?: React.RefObject<HTMLDivElement>;
  onDragEnd?: () => void;
}

export default function Draggable<T>({ children, disabled, dragData, dragRef, onDragEnd }: DraggableProps<T>) {
  const fallbackDragRef = useRef<HTMLDivElement>(null);

  const { startDragging } = useContext(DragContext) as DragContextType<T>;

	useEffect(() => {
    const ref = dragRef || fallbackDragRef;
		if (!ref?.current) return;
		const onStartDragging = (e: MouseEvent | TouchEvent) => {
			if (disabled) return;
			startDragging(e, dragData, ref, { onDragEnd });
		}
		ref.current.addEventListener("mousedown", onStartDragging, true);
		ref.current.addEventListener("touchstart", onStartDragging, true);
		return () => {
			ref.current?.removeEventListener("mousedown", onStartDragging, true);
			ref.current?.removeEventListener("touchstart", onStartDragging, true);
		};
	}, [dragRef, disabled]);

  return (
    <div
      className="relative"
			ref={dragRef}
    >
      {children}
    </div>
  );
}
