import {
  CARD_BORDER_HEIGHT,
  CARD_BORDER_WIDTH, FullCard,
  useGameAnimation,
  useGameEventListener
} from "@repo/ui";
import { useState } from "react";
import { animationTimeline, inPx } from "@repo/lib";
import { CardType, DrawCardEvent } from "game_engine";
import { HAND_CARD_RATIO } from "../../../../../apps/GameClient/src/game/gui/card/InHandCard";
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
  isPvp: false,
};

function HandCard({ position, size }: { position: number; size: number }) {
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

  const fullCardSize = 320;
  const cardWidth = size * CARD_BORDER_WIDTH * HAND_CARD_RATIO;

  return (
    <div
      className="relative"
      style={{
        width: inPx(size * CARD_BORDER_WIDTH * HAND_CARD_RATIO),
        height: inPx(size * CARD_BORDER_HEIGHT * HAND_CARD_RATIO),
      }}
    >
      <div
        style={{
          transform: `scale(${cardWidth / fullCardSize})`,
          transformOrigin: "top left",
        }}
      >
        <FullCard
          card={card}
          size={1}
          showEffectDesc
          illustrationChildren={
            <div className="absolute top-0 left-0 w-full h-full z-10">
              <div className="absolute right-[3px] top-[4px] flex flex-col gap-2 z-10 scale-[200%]">
                <HandCardEffects isPlayerCard={true} position={position} />
              </div>
              <InHandCardIllustration position={position} />
            </div>
          }
        />
      </div>
    </div>
  );
}

function InHandCardIllustration({ position }: { position: number }) {
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
    <div
      ref={animationRef}
      className="absolute top-0 w-full h-full bg-slate-800 opacity-60 origin-top"
    />
  );
}

export default HandCard;
