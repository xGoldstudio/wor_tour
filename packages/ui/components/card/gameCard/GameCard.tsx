import { useRef, useState } from "react";
import {
  AfterPlaceCardEvent,
  CardDamagResolveEvent,
  CardDestroyedEvent, ChangeAttackSpeedEvent, HealCardEvent,
  InGameCardType
} from "game_engine";
import useGameEventListener from "../useGameEventListener";
import useGameCardRingAnimation from "./gameCardRing/useGameCardRingAnimation";
import GameCardRing from "./gameCardRing/GameCardRing";
import useGameCardAnimation from "./gameCardAnimation/useGameCardAnimation";
import useGameCardFlash from "./gameCardFlash/useGameCardFlash";
import GameCardFlash from "./gameCardFlash/gameCardFlash";
import GameCardDesign from "./gameCardDesign/GameCardDesgin";

const dummyCard: InGameCardType = {
  id: -1,
  instanceId: -1,
  maxHp: 0,
  hp: 0,
  dmg: 1,
  attackSpeed: 1,
  initialAttackSpeed: 1,
  modifierOfAttackSpeedPercentage: 0,
  startAttackingTick: null,
  endAttackingTick: null,
  startAttackingAnimationTick: null,
  rarity: "common",
  states: [],
  illustration: "",
  worldIllustration: "",
  initiatorId: -1,
};

function GameCard({
  isPlayerCard,
  position,
}: {
  isPlayerCard: boolean;
  position: number;
}) {
  const [card, setCard] = useState<InGameCardType>(dummyCard);
  const cardRef = useRef<HTMLDivElement>(null);
  const trackedInstanceId = useRef<number | null>(null);
  const damageFlash = useGameCardFlash();
  const healFlash = useGameCardFlash();
  useGameCardAnimation({ cardRef, cardPosition: position, isPlayerCard, trackedInstanceId });

  useGameEventListener<AfterPlaceCardEvent>({
    type: "afterPlaceCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card) {
        setCard(card);
        trackedInstanceId.current = card.instanceId;
      }
      damageFlash.clear();
      healFlash.clear();
    },
    filter: (event) =>
      event.position === position && event.isPlayer === isPlayerCard,
  });

  useGameEventListener<CardDestroyedEvent>({
    type: "cardDestroyed",
    action: () => {
      trackedInstanceId.current = null;
    },
    filter: (event) => event.instanceId === trackedInstanceId.current,
  });

  useGameEventListener<CardDamagResolveEvent>({
    type: "cardDamageResolve",
    action: damageFlash.triggerFlash,
    filter: (event) => event.initiator.instanceId === trackedInstanceId.current,
  });
  useGameEventListener<HealCardEvent>({
    type: "healCard",
    action: healFlash.triggerFlash,
    filter: (event) => event.instanceId === trackedInstanceId.current,
  });

  const {
    ref: decreaseAsRingRef,
    activate: activateDecreaseRing,
    deactivate: deactivateDecreaseRing,
  } = useGameCardRingAnimation({ trackedInstanceId, rotationSpeed: 0.5 });
  const {
    ref: increaseAsRingRef,
    activate: activateIncreaseRing,
    deactivate: deactivateIncreaseRing,
  } = useGameCardRingAnimation({ trackedInstanceId, rotationSpeed: 1 });

  useGameEventListener<ChangeAttackSpeedEvent>({
    type: "changeAttackSpeed",
    action: (event, state) => {
      const card = state.getCardByInstance(event.instanceId);
      if (!card) return;
      if (card.attackSpeed > card.initialAttackSpeed) {
        activateIncreaseRing();
      } else {
        deactivateIncreaseRing();
      }
      if (card.attackSpeed < card.initialAttackSpeed) {
        activateDecreaseRing();
      } else {
        deactivateDecreaseRing();
      }
    },
    filter: (e) => e.instanceId === trackedInstanceId.current,
  });

  return (
    <div className="hidden opacity-0" ref={cardRef}>
      <GameCardRing filter="hue-rotate(180deg)" ringRef={decreaseAsRingRef} />
      <GameCardRing ringRef={increaseAsRingRef} />
      <GameCardFlash colorA="#2105ad" colorB="#4b429d" flashRef={healFlash.flashRef} />
      <GameCardFlash colorA="#FF0000" colorB="#ff6e6e" flashRef={damageFlash.flashRef} />
      <GameCardDesign
        card={card}
        size={2.5}
        isPlayerCard={isPlayerCard}
        position={position}
        trackedInstanceId={trackedInstanceId}
      >
        <div className="animationProgress absolute top-0 w-full h-full bg-slate-800 opacity-60 origin-top" />
      </GameCardDesign>
    </div>
  );
}

export default GameCard;
