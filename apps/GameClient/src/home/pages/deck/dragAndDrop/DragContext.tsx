import { createContext, useRef } from "react";

export interface DragContextType<DataT = unknown> {
  registerDroppable: ({
    onDrop,
    ref,
  }: {
    onDrop: (data: DataT) => void;
    ref: React.RefObject<HTMLElement>;
  }) => void;
  removeDroppable: (ref: React.RefObject<HTMLElement>) => void;
  startDragging: (
    e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent,
    data: DataT,
    dragRef: React.RefObject<HTMLElement>,
		options?: StartDraggingOptions,
  ) => void;
  isDragging: React.RefObject<boolean>;
}

interface StartDraggingOptions  { onDragEnd?: (e: TouchEvent | MouseEvent) => void }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DragContext = createContext<DragContextType<any> | null>(null);

export default function DragContextProvider<T = unknown>({
  children,
}: {
  children: React.ReactNode;
}) {
  const droppables = useRef<
    Map<React.RefObject<HTMLElement>, (data: T) => void>
  >(new Map());
  const isDragging = useRef<boolean>(false);

  function registerDroppable({
    onDrop,
    ref,
  }: {
    onDrop: (data: T) => void;
    ref: React.RefObject<HTMLElement>;
  }) {
    droppables.current.set(ref, onDrop);
  }

  function removeDroppable(ref: React.RefObject<HTMLElement>) {
    droppables.current.delete(ref);
  }

  function startDragging(
    e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent,
    data: T,
    dragRef: React.RefObject<HTMLElement>,
		options?: StartDraggingOptions,
  ) {
    if (!dragRef.current) {
      return;
    }
    // position + transform px
    const clientX = "touches" in e ? e.touches[0].clientX : e.pageX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.pageY;
    const initialCoords = getOriginalPosition(dragRef.current);
    initialCoords.x = initialCoords.x + (clientX - initialCoords.x);
    initialCoords.y = initialCoords.y + (clientY - initialCoords.y);
    dragRef.current.style.transition = "";
    function onMove(
      e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
    ) {
      if (!dragRef.current) return;
      isDragging.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.pageY;

      const offsetX = clientX - initialCoords.x;
      const offsetY = clientY - initialCoords.y;

      dragRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    function mouseUp(e: MouseEvent | TouchEvent) {
      isDragging.current = false;
      document.removeEventListener("click", mouseUp);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      onDrop(e, data);
			options?.onDragEnd?.(e);
      if (!dragRef.current) return;
      dragRef.current.style.transition = "transform 0.5s";
      dragRef.current.style.transform = "";
      dragRef.current.style.zIndex = "";
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("click", mouseUp);
    dragRef.current.style.zIndex = "999";
  }

  function onDrop(
    e: MouseEvent | TouchEvent,
    data: T
  ) {
		droppables.current.forEach((onDrop, ref) => {
			if (!ref.current) {
				droppables.current.delete(ref);
				return;
			}
			const rect = ref.current.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.pageX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.pageY;
			if (
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			) {
				onDrop(data);
			}
		});
  }

  return (
    <DragContext.Provider
      value={{
        startDragging,
        registerDroppable,
        removeDroppable,
        isDragging,
      }}
    >
      {children}
    </DragContext.Provider>
  );
}

interface Position {
  x: number;
  y: number;
}

function getOriginalPosition(element: HTMLElement): Position {
  const transform = getComputedStyle(element).transform;
  const matrix = new DOMMatrixReadOnly(transform);
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left - matrix.m41 + window.scrollX, // m41 is translateX
    y: rect.top - matrix.m42 + window.scrollY, // m42 is translateY
  };
}
