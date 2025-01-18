import usePlayerStore from "@/home/store/playerStore/playerStore";
import { Button } from "@repo/ui";
import { CardType, getCardStrength } from "game_engine";
import { WandSparkles } from "lucide-react";
import { NUMBER_OF_CARD_IN_DECK } from "@/const";
import { getDeckStrength } from "@/services/MatchmakingService/buildDeck";
import { useMemo } from "react";

export default function ButtonOptimizeStrengthDeck({
  currentDeck,
}: {
  currentDeck: CardType[];
}) {
  const collection = usePlayerStore(() => usePlayerStore.getState().collection);
  const powerTotal = getDeckStrength(currentDeck);
  const [optimizedDeck, optimizedDeckStrength] = useMemo(() => {
    const completeCollection = usePlayerStore
      .getState()
      .getCollectionCompleteInfo(collection, [], false);
    const collectionSorted = completeCollection
      .map((card) => [getCardStrength(card), card] as [number, CardType])
      .sort((a, b) => b[0] - a[0]);
    const deckAndStrength = collectionSorted.splice(0, NUMBER_OF_CARD_IN_DECK);
    const deck = deckAndStrength.map(([, card]) => card.id);
    return [deck, getDeckStrength(deckAndStrength.map(([, card]) => card))];
  }, [currentDeck, collection]);

  function optimizeDeck() {
		if (!(powerTotal < optimizedDeckStrength)) return;
		console.log("Optimizing deck");
    usePlayerStore
      .getState()
      .deck.filter((id) => id !== 0)
      .forEach((id) => {
        usePlayerStore.getState().removeCardFromDeck(id);
      });
    optimizedDeck.forEach((id) => {
      usePlayerStore.getState().addCardToDeck(id);
    });
    return;
  }

  return (
    <Button action={optimizeDeck} small className="px-4" hFull disabled={powerTotal >= optimizedDeckStrength} isNew>
      <WandSparkles strokeWidth={2.25} size={20} />
    </Button>
  );
}
