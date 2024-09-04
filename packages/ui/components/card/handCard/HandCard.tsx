import {
  CardBorder,
  CardContentIllustartion,
  ManaBall,
  useGameAnimation,
  useGameEventListener
} from "@repo/ui";
import { useState } from "react";
import {
  animationTimeline,
  CardType,
} from "@repo/lib";
import { DrawCardEvent } from "game_engine";
import HandCardEffects from "./HandCardEffetcs";

const dummyCard: CardType = {
  name: "string",
  cost: 0,
  illustration: "string",
  worldIllustration: "string",
  dmg: 0,
  hp: 0,
  attackSpeed: 0,
  rarity: "common",
  id: 0,
  states: [],
  level: 1,
  world: 1,
};

function HandCard({
  position,
}: {
  position: number;
}) {
  const [card, setCard] = useState<CardType>(dummyCard);

  useGameEventListener({
    type: "drawCard",
    action: (_, data) => {
      const drawedCard = data.playerHand[position];
      if (!drawedCard) return;
      setCard(drawedCard);
    },
    filter: (e) =>
      (e as DrawCardEvent).position === position &&
      (e as DrawCardEvent).isPlayer,
  });

  return (
    <div className="relative">
      <CardBorder rarity={card.rarity} size={1.8}>
        <InHandCardIllustration card={card} position={position} />
        <div className="absolute right-[3px] top-[4px] flex flex-col gap-2">
          <HandCardEffects isPlayerCard={true} position={position} />
        </div>
      </CardBorder>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-75">
        <ManaBall mana={card.cost} />
      </div>
    </div>
  );
}

function InHandCardIllustration({
  card,
  position,
}: {
  card: CardType;
  position: number;
}) {
  const animationRef = useGameAnimation({
    tl: (ref, state) => {
      const usingCard = state.playerHand[position];
      return animationTimeline(
        (usingCard?.cost ?? 0) * state.playerManaSpeed
      ).add(ref, { scaleY: 1 }, { values: { scaleY: 0 } });
    },
    getProgress: (state, currentTick) => {
      const usingCard = state.playerHand[position];
      if (
        !usingCard ||
        (usingCard.cost !== null && state.playerMana > usingCard.cost) ||
        state.playerTickStartEarningMana === null
      ) {
        return -1;
      }
      return (
        state.playerMana * state.playerManaSpeed +
        (currentTick - state.playerTickStartEarningMana!)
      );
    },
  });

  return (
    <div className="relative w-full h-full">
      <CardContentIllustartion card={card} size={1.8} />
      <div
        ref={animationRef}
        className="absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top"
      />
    </div>
  );
}

export default HandCard;
