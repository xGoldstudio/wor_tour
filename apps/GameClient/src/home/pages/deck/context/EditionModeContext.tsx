import { ReactNode, useState } from "react";
import { EditionModeContext, useEditionMode } from "./UseEditionMode";
import { PlayerCardCollectionInfo } from "../cardFilters";
import usePlayerStore from "@/home/store/playerStore/playerStore";

export function EditionModeProvider({ children }: { children: ReactNode }) {
  const [editionMode, setEditionMode] = useState(false);
  const [replacingCard, setReplacingCard] =
    useState<PlayerCardCollectionInfo | null>(null);
  return (
    <EditionModeContext.Provider
      value={{ editionMode, setEditionMode, replacingCard, setReplacingCard }}
    >
      {children}
    </EditionModeContext.Provider>
  );
}

export function useEditDeckActions() {
  const { setReplacingCard, replacingCard } = useEditionMode();
  const { addCardToDeck, removeCardFromDeck ,isDeckFull } = usePlayerStore((state) => ({
    addCardToDeck: state.addCardToDeck,
    isDeckFull: state.isDeckFull,
    removeCardFromDeck: state.removeCardFromDeck,
  }));

  function addCard(cardId: number) {
    const card = usePlayerStore.getState().getCompleteInfo(cardId);``
    if (isDeckFull) {
      setReplacingCard(card);
    } else {
      addCardToDeck(card.id);
    }
  }

  function removeCard(cardId: number) {
    removeCardFromDeck(cardId);
  }

  function replaceCard(cardToReplaceId: number) {
    if (!replacingCard) {
      console.warn("Impossible to replace this card, no card selected");
      return;
    }
    removeCardFromDeck(cardToReplaceId);
    addCardToDeck(replacingCard.id);
    setReplacingCard(null);
  }

  return { addCard, removeCard, replaceCard };
}
