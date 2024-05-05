import { useState } from "react";
import BoostedOpeningModal from "./BoostedOpeningModal";
import { Button } from "@/components/ui/button";
import findCard, { cardsByRarity } from "./cards";
import Card from "./Card";

const defaultCollection = new Map<number, number>();
defaultCollection.set(1,1);
defaultCollection.set(2,1);
defaultCollection.set(3,1);
defaultCollection.set(4,1);
defaultCollection.set(5,1);
defaultCollection.set(6,1);

export default function Home() {
  const [boostedCards, setBoostedCards] = useState<null | number[]>(null);
  const [player, setPlayer] = useState({
    golds: 5000,
    collection: defaultCollection,
    deck: [1,2,3,4,5,6],
  });

  function buyCards() {
    const cardsOpened = generateCards(3);
    setPlayer({
      golds: player.golds - 100,
      collection: updateCollection(player.collection, cardsOpened),
      deck: player.deck,
    });
    setBoostedCards(cardsOpened);
  }

  function addCardToDeck(cardId: number) {
    setPlayer({
      golds: player.golds,
      collection: player.collection,
      deck: [...player.deck, cardId],
    })
  }

  function removeFromDeck(cardId: number) {
    setPlayer({
      golds: player.golds,
      collection: player.collection,
      deck: player.deck.filter(id => cardId !== id),
    })
  }


  function updateCollection(collection: Map<number, number>, cards: number[]) {
    cards.forEach(id => {
      const existPlaceholder = collection.get(id);
      if (existPlaceholder !== undefined) {
        collection.set(id, existPlaceholder + 1);
      } else {
        collection.set(id, 1);
      }
    })
    return collection;
  }

  function chooseRarity() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber <= 60) {
        return "common";
    } else if (randomNumber <= 90) {
        return "rare";
    } else if (randomNumber <= 98) {
        return "epic";
    } else {
        return "legendary";
    }
  }

  const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  function generateCards(amount: number) {
    const result = [];
    for (let i = 0; i < amount; i++) {
      result.push(getRandomElement(cardsByRarity[chooseRarity()]).id)
    }
    return result;
  }

  const ownedCards = [...player.collection.keys()];

  return (
    <div className="w-screen flex flex-col items-center gap-4 pt-4">
      <div>Gold: {player.golds}</div>
      <BoostedOpeningModal open={!!boostedCards} closeModal={() => setBoostedCards(null)} cardIds={boostedCards ?? []}/>
      <Button onClick={buyCards} disabled={player.deck.length !== 6}>Play game</Button>
      <Button onClick={buyCards}>Buy cards (100 golds)</Button>
      <div className="flex gap-4">
        <div>
        <h3 className="text-xl pb-2">Collection</h3>
          <div className="grid grid-cols-4 gap-4 border-2 p-4 rounded-md">
            {ownedCards.map(id => (
              <div>
                <Card card={findCard(id)} />
                <div className="flex justify-between items-center pt-2">
                  {player.deck.find(deckId => id === deckId)
                    ? <Button size="sm" onClick={() => removeFromDeck(id)}>Remove</Button>
                    : <Button size="sm" onClick={() => addCardToDeck(id)}>Use</Button>
                  }
                  <p className="text-center">x {player.collection.get(id)}</p>
                </div>  
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl pb-2">Deck ({player.deck.length}/6)</h3>
          <div className="gap-4 flex flex-col border-2 p-4 rounded-md">
            {player.deck.map(id => (
              <Card card={findCard(id)} />
            ))}
          </div>
        </div>
      </div>
      {/* <Card card={findCard(1)} />
    <Card card={findCard(2)} /> */}
    </div>
  );
}
