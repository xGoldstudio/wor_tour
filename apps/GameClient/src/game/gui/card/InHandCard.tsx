import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import {
  CARD_BORDER_HEIGHT,
  CARD_BORDER_WIDTH,
  HandCard,
  useGameEventListener,
  useSyncGameAnimation,
} from "@repo/ui";
import { useRef } from "react";
import { animationTimeline, inPx } from "@repo/lib";
import {
  ClockReturn,
  DrawCardEvent,
  EventType,
  GameStateObject,
} from "game_engine";

export const HAND_CARD_RATIO = 1.8;

export default function InHandCard({
  position,
  clock,
  gameState,
  size = HAND_CARD_RATIO,
}: {
  position: number;
  clock: ClockReturn<EventType>;
  gameState: GameStateObject;
  size?: number;
}) {
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
      (e as DrawCardEvent).position === position &&
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
    function onMove(e: MouseEvent | TouchEvent) {
      if (cardRef.current && ref.current && dragRef.current) {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const offsetX = clientX - centerX;
        const offsetY = clientY - centerY;

        dragRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    }
    function mouseUp() {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("touchend", mouseUp);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
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
    document.addEventListener("touchmove", onMove);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("touchend", mouseUp);
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
            style={{
              width: inPx(size * CARD_BORDER_WIDTH * HAND_CARD_RATIO),
              height: inPx(size * CARD_BORDER_HEIGHT * HAND_CARD_RATIO),
            }}
            onMouseDown={tryToMoveCard}
            onTouchStartCapture={tryToMoveCard}
            ref={cardRef}
          >
            <HandCard position={position} size={size} />
          </div>
        </div>
      </div>
    </>
  );
}
