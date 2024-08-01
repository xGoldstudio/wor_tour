import { NUMBER_OF_CARD_IN_DECK } from "@/const";
import { CardType, getTargetStrength } from "@repo/lib";

export default function buildDeck(targetStrength: number, delta: number, cardPool: [number, CardType][]) {
  const deck: [number, CardType][] = [];
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++) {
    deck.push(getRandomInList(cardPool.filter(c => deck.find(deckCard => deckCard[1].id === c[1].id) === undefined)));
  }
  deck.sort((a, b) => a[0] - b[0]);
  function getStrength() {
    return deck.reduce((acc, card) => acc + card[0], 0);
  }
  let maxIt = 100;
  let currStrength = getStrength();
  const poolByStrength = new Map<number, CardType[]>();
  cardPool.forEach(c => {
    if (!poolByStrength.has(c[0])) {
      poolByStrength.set(c[0], []);
    }
    poolByStrength.get(c[0])!.push(c[1]);
  });
  const poolByStrengthMapped: number[] = [...poolByStrength.keys()].sort((a, b) => a - b);
  function findCardInDeck(cardToSkip: CardType) {
    return (poolCard: CardType) => deck.map(c => c[1]).filter(c => c.id !== cardToSkip.id).find(dc => dc.id === poolCard.id) === undefined
  }
  const trg = targetStrength - (delta / 2);
  while ((currStrength > (targetStrength - delta) || currStrength < (targetStrength)) && maxIt > 0) {
    maxIt -= 1;
    let closestStrength = null;
    let closestCardToChange: [number, number] | null = null;
    for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++) {
      const card = deck[i];
      // get closest strength 
      for (let j = 0; j < poolByStrengthMapped.length; j++) {
        const nextStrength = currStrength - (card[0] - poolByStrengthMapped[j]);
        if (
          (closestStrength === null
            || (Math.abs(trg - nextStrength) < Math.abs(trg - closestStrength)))
          && poolByStrength.get(poolByStrengthMapped[j])!.find(findCardInDeck(card[1])) !== undefined
        ) {
          closestStrength = nextStrength;
          closestCardToChange = [i, j];
        }
      }
    }
    if (closestCardToChange === null) {
      break;
    }
    const [cardIndex, poolIndex] = closestCardToChange;
    deck[cardIndex] = [
      poolByStrengthMapped[poolIndex],
      getRandomInList(poolByStrength.get(poolByStrengthMapped[poolIndex])!.filter(findCardInDeck(deck[cardIndex][1]))!)
    ];
    currStrength = getStrength();
  }
  return deck.map(card => card[1]);
}

function getRandomInList<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getDeckStrength(deck: CardType[]) {
  return deck.reduce((acc, card) => acc + getTargetStrength(card), 0);
}
