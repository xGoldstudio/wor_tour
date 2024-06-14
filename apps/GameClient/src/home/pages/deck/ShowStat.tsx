import { CardType } from "@repo/ui";
import { useState } from "react";

type DetailedCardType = CardType & { isInDeck: boolean };

interface ShowStatProps {
  detailledDeck: DetailedCardType[];
}

export function ShowStat({ detailledDeck }: ShowStatProps) {
  const [showStat, setShowStat] = useState(false);
  let costAverage = 0;
  let dmgAverage = 0;
  let attackSpeedAverage = 0;
  let hpAverage = 0;
  for (let i = 0; i < 8; i++) {
    costAverage += detailledDeck[i].cost;
    dmgAverage += detailledDeck[i].dmg;
    attackSpeedAverage += detailledDeck[i].attackSpeed;
    hpAverage += detailledDeck[i].hp;
  }
  costAverage /= 8;
  dmgAverage /= 8;
  attackSpeedAverage /= 8;
  hpAverage /= 8;
  return (
    <div>
      <div className="absolute right-16 bottom-48">
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
