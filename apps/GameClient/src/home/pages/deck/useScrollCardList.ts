import { useState } from "react";

export default function useScrollCardList(
  defaultPosition: number,
  maximumPosition: number,
  options?: { pages?: number, onPageChange: (newPage: number) => void, onLastPage?: number }
) {
  const [isPressed, setIsPressed] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);
  const [page, setPage] = useState(0);
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

  function changePage(value: number) {
    setPage(page => {
      const newPage = page + value;
      options?.onPageChange(newPage);
      return newPage;
    });
  }

  function updatePosition(value: number) {
    (() => {
      const newPosition = currentPosition + value;
      if (options?.pages !== undefined) {
        if ((options.pages - 1) > page && newPosition > maximumPosition - 1) {
          setCurrentPosition(0);
          return changePage(1);
        } else if (page > 0 && newPosition < 0) {
          setCurrentPosition(maximumPosition - 1);
          return changePage(-1);
        }
      }
      const lastPositionPossible = options?.onLastPage !== undefined && options.pages !== undefined && (options.pages - 1) === page ? options.onLastPage : maximumPosition;
      setCurrentPosition((prev) =>
        Math.max(0, Math.min(lastPositionPossible - 1, prev + value))
      );
    })();
    setIsPressed(false);
  }

  return {
    currentPosition,
    setIsPressed,
    changePosition,
    page,
  };
}
