import { ReactNode, useState } from "react";
import { EditionModeContext, useEditionMode } from "./UseEditionMode";
import { PlayerCardCollectionInfo } from "../cardFilters";
import usePlayerStore from "@/home/store/playerStore/playerStore";

export function EditionModeProvider({ children }: { children: ReactNode }) {
  const [editionMode, setEditionModeInternal] = useState(false);
  const [replacingCard, setReplacingCardInternal] =
    useState<PlayerCardCollectionInfo | true | null>(null);

  function setEditionMode(value: boolean) {
    if (value === false) {
      setReplacingCard(null);
    }
    setEditionModeInternal(value);
  }

  function setReplacingCard(value: PlayerCardCollectionInfo | true | null) {
    if (value !== null) {
      setEditionMode(true);
    }
    setReplacingCardInternal(value);
  }

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
  const { addCardToDeck, removeCardFromDeck, isDeckFull } = usePlayerStore((state) => ({
    addCardToDeck: state.addCardToDeck,
    isDeckFull: state.isDeckFull,
    removeCardFromDeck: state.removeCardFromDeck,
    deckSwapCards: state.deckSwapCards,
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
    if (!replacingCard || replacingCard === true) {
      return;
    }
    removeCardFromDeck(cardToReplaceId);
    addCardToDeck(replacingCard.id);
    setReplacingCard(null);
  }

  return { addCard, removeCard, replaceCard };
}
