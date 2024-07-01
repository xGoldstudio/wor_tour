import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import { motion, useDragControls } from "framer-motion";
import {
  FRAME_TIME,
  manaSpeed,
  useTriggerEvent,
} from "../../gameBehavior/useGameEvents";
import { useGameAnimation } from "../../gameBehavior/animation/useGameSyncAnimation";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";
import { CardType, ManaBall } from "@repo/ui";
import animationTimeline from "@/game/gameBehavior/animation/timeline";

function InHandCard({ card, position }: { card: CardType; position: number }) {
  const setSelectedCard = useGameInterface((state) => state.setSelectedCard);
  const removeCardTarget = useGameInterface((state) => state.removeCardTarget);
  const unselectCard = useGameInterface((state) => state.unselectCard);

  const dragControls = useDragControls();

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
    if (card.cost > mana) {
      return;
    }
    dragControls.start(e, { snapToCursor: true });
  }

  return (
    <div onPointerDown={startDrag} className="relative">
      <motion.div
        className="w-fit h-fit bg-black rounded-sm relative select-none"
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

const manaFrames = manaSpeed / FRAME_TIME;

function InHandCardIllustration({ card }: { card: CardType }) {
  const animationRef = useGameAnimation({
    tl: (ref) =>
      animationTimeline(card.cost * manaFrames).add(
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
        state.playerMana * manaFrames +
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
