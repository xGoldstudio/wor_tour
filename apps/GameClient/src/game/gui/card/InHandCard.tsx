import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import { motion, useDragControls } from "framer-motion";
import {
  DrawCardEvent,
  useTriggerEvent,
} from "../../gameBehavior/useGameEvents";
import {
  useGameAnimation,
  useSyncGameAnimation,
} from "../../gameBehavior/animation/useGameSyncAnimation";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";
import { CardType, ManaBall } from "@repo/ui";
import animationTimeline from "@/game/gameBehavior/animation/timeline";
import { useRef, useState } from "react";
import useGameEventListener from "@/game/gameBehavior/useGameEventListener";

export const dummyCard: CardType = {
  name: "string",
  cost: 0,
  illustration: "string",
  worldIllustration: "string",
  dmg: 0,
  hp: 0,
  attackSpeed: 0,
  rarity: "common",
  id: 0,
  effects: {},
  level: 1,
  world: 1,
};

function InHandCard({ position }: { position: number }) {
  const setSelectedCard = useGameInterface((state) => state.setSelectedCard);
  const removeCardTarget = useGameInterface((state) => state.removeCardTarget);
  const unselectCard = useGameInterface((state) => state.unselectCard);
  const [card, setCard] = useState<CardType>(dummyCard);
  const ref = useRef<HTMLDivElement | null>(null);

  const dragControls = useDragControls();
  const { triggerAnimation: triggerDrawAnimation } = useSyncGameAnimation();

  useGameEventListener({
    type: "drawCard",
    action: (_, data) => {
      const drawedCard = data.playerHand[position];
      const staticCardTarget = document
        .getElementById("staticCardWrapper")
        ?.querySelector(".staticCard") as HTMLDivElement;
      if (!drawedCard || !ref.current || !staticCardTarget) return;
      setCard(drawedCard);
      const originTransformX =
        staticCardTarget.getBoundingClientRect().left -
        ref.current.getBoundingClientRect().left;
      const originTransformY =
        staticCardTarget.getBoundingClientRect().top - ref.current.getBoundingClientRect().top;
      triggerDrawAnimation({
        duration: 10,
        computeStyle: animationTimeline(10).add(
          ref.current,
          {
            opacity: 100,
            scale: 0.75,
            x: originTransformX,
            y: originTransformY,
          },
          {
            values: {
              opacity: 100,
              scale: 1,
              x: 0,
              y: 0,
            },
            ease: [0, 0.42, 1, 1],
          }
        ).progress,
      });
    },
    filter: (e) =>
      (e as DrawCardEvent).handPosition === position &&
      (e as DrawCardEvent).isPlayer,
  });

  function onUnselectCard() {
    const cardTarget = useGameInterface.getState().cardTarget;
    placeNewCard(position, cardTarget);
    unselectCard();
  }

  function onSelectCard() {
    setSelectedCard(position);
  }

  const triggerEvent = useTriggerEvent();

  function placeNewCard(
    cardInHandPosition: number,
    targetPosition: number | null
  ) {
    if (targetPosition === null) {
      return;
    }
    triggerEvent({
      type: "placeCard",
      isPlayer: true,
      targetPosition,
      cardInHandPosition,
    });
    removeCardTarget();
  }

  function startDrag(e: React.PointerEvent) {
    const mana = useGameStore.getState().state.playerMana;
    const card = useGameStore.getState().state.playerHand[position];
    if (!card || card.cost > mana) {
      return;
    }
    dragControls.start(e, { snapToCursor: true });
  }

  return (
    <div onPointerDown={startDrag} className="relative h-fit w-fit opacity-0" ref={ref}>
      <motion.div
        className="w-fit h-fit bg-black rounded-sm select-none relative"
        dragSnapToOrigin
        onDragStart={onSelectCard}
        onDragEnd={onUnselectCard}
        drag={true}
        whileDrag={{ zIndex: 9999, scale: 1.2, pointerEvents: "none" }}
        dragControls={dragControls}
        dragListener={false}
      >
        <CardBorder rarity={card.rarity} size={1.8}>
          <InHandCardIllustration card={card} />
        </CardBorder>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-75">
          <ManaBall mana={card.cost} />
        </div>
      </motion.div>
    </div>
  );
}

function InHandCardIllustration({ card }: { card: CardType }) {
  // const manaSpeed = 0;

  const animationRef = useGameAnimation({
    tl: (ref, state) =>
      animationTimeline(card.cost * state.playerManaSpeed).add(
        ref,
        { scaleY: 1 },
        { values: { scaleY: 0 } }
      ),
    getProgress: (state, currentTick) => {
      if (
        (card.cost !== null && state.playerMana > card.cost) ||
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

export default InHandCard;
