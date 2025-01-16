import { ReactNode, useState } from "react";
import { EditionModeContext, useEditionMode } from "./UseEditionMode";
import { PlayerCardCollectionInfo } from "../cardFilters";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { cardsAddingAnimationService } from "@/services/inject";

export function EditionModeProvider({ children }: { children: ReactNode }) {
  const [editionMode, setEditionModeInternal] = useState(false);
  const [replacingCard, setReplacingCard] =
    useState<PlayerCardCollectionInfo | true | null>(null);

  function setEditionMode(value: boolean) {
    if (value === false) {
      setReplacingCard(null);
    }
    setEditionModeInternal(value);
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
  const { setReplacingCard, replacingCard, setEditionMode, editionMode } = useEditionMode();
  const { addCardToDeck, removeCardFromDeck, isDeckFull } = usePlayerStore((state) => ({
    addCardToDeck: state.addCardToDeck,
    isDeckFull: state.isDeckFull,
    removeCardFromDeck: state.removeCardFromDeck,
    deckSwapCards: state.deckSwapCards,
  }));

  function addCardAddingAnimation(cardId: number) {
    if (!editionMode) return;
    cardsAddingAnimationService.addCardAddingAnimation(cardId);
  }

  function addCard(cardId: number) {
    const card = usePlayerStore.getState().getCompleteInfo(cardId);
    addCardAddingAnimation(cardId);
    if (isDeckFull) {
      setEditionMode(true);
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
    // we only animate the new card and not the old one
    addCardAddingAnimation(replacingCard.id);
    removeCardFromDeck(cardToReplaceId);
    addCardToDeck(replacingCard.id);
    setReplacingCard(null);
  }

  function swapCards(index: number, originCardId: number) {
    const replacedCardId = usePlayerStore.getState().deckSwapCards(index, originCardId);
    addCardAddingAnimation(replacedCardId);
    addCardAddingAnimation(originCardId);
    setReplacingCard(null);
  }

  return { addCard, removeCard, replaceCard, swapCards };
}
