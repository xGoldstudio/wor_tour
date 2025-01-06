import { createRef, useEffect, useState } from "react";
import { PlayerCardCollectionInfo } from "./cardFilters";
import { DeckCardUI } from "./DeckCardUI";

export function DisablableDeckCardUI({
  card,
  parentScrollRef,
}: {
  card: PlayerCardCollectionInfo;
  parentScrollRef: React.RefObject<HTMLDivElement>;
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
        <DeckCardUI card={card} size={1} deckCard />
      ) : (
        <div className="w-[128px] h-[178px] bg-slate-500 rounded-sm opacity-90 animate-pulse"></div>
      )}
    </div>
  );
}
