import { DeckCardUI } from "./DeckCardUI";
import { useOnClickOutside } from "@repo/ui";
import { useEditionMode } from "./context/UseEditionMode";
import { useRef } from "react";

export default function CardReplacement({ size }: { size: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const { replacingCard, setReplacingCard } = useEditionMode();

  useOnClickOutside(ref, () => {
    setReplacingCard(null);
  }, !!replacingCard);

  if (!replacingCard) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 pt-4 items-center grow relative">
      <p className="text-md font-bold text-slate-50">Select card to be replaced</p>
      <div ref={ref}>
        <DeckCardUI card={replacingCard} size={size} isSelectable={false} />
      </div>
    </div>
  );
}
