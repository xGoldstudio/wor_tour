import { DeckCardUI } from "./deckCardUi/DeckCardUI";
import { useOnClickOutside } from "@repo/ui";
import { useEditionMode } from "./context/UseEditionMode";
import { useContext, useRef } from "react";
import { DragContext, DragContextType } from "./dragAndDrop/DragContext";

export default function CardReplacement({ size }: { size: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const { replacingCard, setReplacingCard } = useEditionMode();
  const { isDragging } = useContext(DragContext) as DragContextType<number>;

  useOnClickOutside(
    ref,
    () => {
      if (isDragging.current) {
        return;
      }
      setReplacingCard(null);
    },
    {
      watching: !!replacingCard,
    }
  );

  if (!replacingCard) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 pt-4 items-center grow relative">
      <p className="text-md font-bold text-slate-50">
        Select card to be replaced
      </p>
      {typeof replacingCard === "object" && (
        <div ref={ref}>
          <DeckCardUI card={replacingCard} size={size} isDeckCard={false} />
        </div>
      )}
    </div>
  );
}
