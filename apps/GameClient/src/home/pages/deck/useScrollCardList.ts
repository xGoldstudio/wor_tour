import { useState } from "react";

export default function useScrollCardList(defaultPosition: number, maximumPosition: number) {
  const [isPressed, setIsPressed] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);
  function changePosition(e: React.MouseEvent<HTMLDivElement>) {
    if (!isPressed) {
      return;
    }

    if (e.movementX > 0) {
      updatePosition(-1);
    } else if (e.movementX < 0) {
      updatePosition(1);
    }
  }

  function updatePosition(value: number) {
    setCurrentPosition((prev) => Math.max(0, Math.min(maximumPosition - 1, prev + value)));
    setIsPressed(false);
  }

  return {
    currentPosition,
    setIsPressed,
    changePosition,
  };
}
