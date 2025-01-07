import { CARD_BORDER_HEIGHT, CARD_BORDER_WIDTH } from "@repo/ui";
import { createRef, useEffect, useState } from "react";

export function DisablableDeckCardUI({
  children,
  parentScrollRef,
  size,
}: {
  children: React.ReactNode;
  parentScrollRef: React.RefObject<HTMLDivElement>;
  size: number;
}) {
  const [isShown, setIsShown] = useState(false);
  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current || !parentScrollRef.current) {
      return;
    }
    // using intersection observer to check if the card is in the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsShown(true);
        } else {
          setIsShown(false);
        }
      },
      {
        root: parentScrollRef.current,
        rootMargin: ref.current.clientHeight * 2 + "px",
        threshold: 0,
      }
    );
    observer.observe(ref.current);
    // cleanup
    return () => {
      observer.disconnect();
    };
  }, [ref, parentScrollRef]);

  return (
    <div className="" ref={ref}>
      {isShown ? (
        children
      ) : (
        <div
          className="bg-slate-500 rounded-sm opacity-90 animate-pulse"
          style={{
            width: CARD_BORDER_WIDTH * size,
            height: CARD_BORDER_HEIGHT * size,
          }}
        ></div>
      )}
    </div>
  );
}
