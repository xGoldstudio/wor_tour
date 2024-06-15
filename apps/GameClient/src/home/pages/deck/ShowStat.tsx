import usePlayerStore from "@/home/store/playerStore";
import { CardType } from "@repo/ui";
import { useState } from "react";

type DetailedCardType = CardType & { isInDeck: boolean };

interface ShowStatProps {
  detailledDeck: DetailedCardType[];
}

export function ShowStat({ detailledDeck }: ShowStatProps) {
  const { NUMBER_OF_CARD_IN_DECK } = usePlayerStore((state) => ({
    NUMBER_OF_CARD_IN_DECK: state.NUMBER_OF_CARD_IN_DECK,
  }));
  const [showStat, setShowStat] = useState(false);
  let costAverage = 0;
  let dmgAverage = 0;
  let attackSpeedAverage = 0;
  let hpAverage = 0;
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++) {
    costAverage += detailledDeck[i].cost;
    dmgAverage += detailledDeck[i].dmg;
    attackSpeedAverage += detailledDeck[i].attackSpeed;
    hpAverage += detailledDeck[i].hp;
  }
  costAverage /= NUMBER_OF_CARD_IN_DECK;
  dmgAverage /= NUMBER_OF_CARD_IN_DECK;
  attackSpeedAverage /= NUMBER_OF_CARD_IN_DECK;
  hpAverage /= NUMBER_OF_CARD_IN_DECK;
  return (
    <div>
      <div className="absolute right-16 bottom-4NUMBER_OF_CARD_IN_DECK">
        <button onClick={() => setShowStat(true)}>...</button>
      </div>
      {showStat && (
        <div className="absolute top-48 left-64 flex flex-col z-50 bg-gray-600">
          <div>Average Cost : {costAverage}</div>
          <div>Damage Average : {dmgAverage.toFixed()}</div>
          <div>Attack Speed Average : {attackSpeedAverage.toFixed(2)}</div>
          <div>Average HP : {hpAverage.toFixed()}</div>
          <button onClick={() => setShowStat(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
