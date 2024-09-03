import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import { HandCard, useGameEventListener, useSyncGameAnimation } from "@repo/ui";
import { useRef } from "react";
import { animationTimeline, getCenterOfBoundingElement } from "@repo/lib";
import { ClockReturn, DrawCardEvent, EventType, GameStateObject } from "game_engine";

export default function InHandCard({ position, clock, gameState }: { position: number, clock: ClockReturn<EventType>, gameState: GameStateObject }) {
  const setSelectedCard = useGameInterface((state) => state.setSelectedCard);
  const removeCardTarget = useGameInterface((state) => state.removeCardTarget);
  const unselectCard = useGameInterface((state) => state.unselectCard);
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
    const cardSelected = useGameInterface.getState().cardSelected;
    placeNewCard(cardSelected, cardTarget);
    unselectCard();
  }

  function onSelectCard() {
    const handCardInstanceId = gameState.getHandCardInstanceId(position, true);
    if (handCardInstanceId !== undefined) {
      setSelectedCard(handCardInstanceId);
    }
  }

  function placeNewCard(
    instanceId: number | null,
    targetPosition: number | null
  ) {
    if (targetPosition === null || instanceId === null) {
      return;
    }
    clock.triggerEvent({
      type: "normalPlaceCard",
      isPlayer: true,
      position: targetPosition,
      instanceId,
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
            <HandCard position={position} />
          </div>
        </div>
      </div>
    </>
  );
}
