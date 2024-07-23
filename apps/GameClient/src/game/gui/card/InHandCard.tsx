import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import {
  useTriggerEvent,
} from "../../gameBehavior/useGameEvents";

import { CardBorder, CardContentIllustartion, Effects, ManaBall, useGameAnimation, useGameEventListener, useSyncGameAnimation } from "@repo/ui";
import { useRef, useState } from "react";
import { dummyCard } from "./const";
import { animationTimeline, CardType, getCenterOfBoundingElement } from "@repo/lib";
import { DrawCardEvent } from "game_engine";

function InHandCard({ position }: { position: number }) {
  const setSelectedCard = useGameInterface((state) => state.setSelectedCard);
  const removeCardTarget = useGameInterface((state) => state.removeCardTarget);
  const unselectCard = useGameInterface((state) => state.unselectCard);
  const [card, setCard] = useState<CardType>(dummyCard);
  const ref = useRef<HTMLDivElement | null>(null);

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
        staticCardTarget.getBoundingClientRect().top -
        ref.current.getBoundingClientRect().top;
      ref.current.style.opacity = "0"; // to avoid the old card to flash before first tick of the animation
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
      position: targetPosition,
      cardInHandPosition,
    });
    removeCardTarget();
  }

  function canStartDrag() {
    const mana = useGameStore.getState().state.playerMana;
    const card = useGameStore.getState().state.playerHand[position];
    return card && card.cost <= mana;
  }

  const cardRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const isPressed = useRef(false);

  function tryToMoveCard() {
    if (isPressed.current || !canStartDrag()) {
      return;
    }
    function onMove(e: MouseEvent) {
      if (cardRef.current && ref.current && dragRef.current) {
        // we compare mouse position with ref bouding box
        const centers = getCenterOfBoundingElement(ref.current);
        dragRef.current.style.transform = `translate(${e.clientX - centers.x}px, ${e.clientY - centers.y}px)`;
      }
    }
    function mouseUp() {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mousemove", onMove);
      isPressed.current = false;
      onUnselectCard();
      if (cardRef.current && ref.current && dragRef.current) {
        cardRef.current.style.transform = "";
        cardRef.current.style.transition = "";
        cardRef.current.style.zIndex = "1";
        dragRef.current.style.pointerEvents = "all";
        dragRef.current.style.transform = "";
      }
    }
    onSelectCard();
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", mouseUp);
    if (cardRef.current && dragRef.current) {
      cardRef.current.style.zIndex = "9999";
      cardRef.current.style.transform = "scale(1.2)";
      cardRef.current.style.transition = "transform 0.2s";
      dragRef.current.style.pointerEvents = "none";
    }
  }

  return (
    <>
      <div className="relative h-fit w-fit opacity-0" ref={ref}>
        <div ref={dragRef}>
          <div
            className="w-fit h-fit bg-black rounded-sm select-none relative"
            onMouseDown={tryToMoveCard}
            ref={cardRef}
          >
            <CardBorder rarity={card.rarity} size={1.8}>
              <InHandCardIllustration card={card} position={position} />
              <div className="absolute right-[3px] top-[4px] flex flex-col gap-2">
                <Effects states={card.states} size={0.7} />
              </div>
            </CardBorder>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-75">
              <ManaBall mana={card.cost} />
            </div>
          </div>
        </div>
      </div>
    </>
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

export default InHandCard;
