import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import { motion, useDragControls } from "framer-motion";
import { FRAME_TIME, manaSpeed } from "../../gameBehavior/useGameEvents";
import { useGameAnimation } from "../../gameBehavior/animation/useGameSyncAnimation";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";
import { CardType, ManaBall } from "@repo/ui";
import { GameStateObject } from "@/game/gameBehavior/gameEngine/gameState";
import animationTimeline from "@/game/gameBehavior/animation/timeline";

function InHandCard({
  card,
  position,
  userPlaceNewCard,
}: {
  card: CardType;
  position?: number;
  userPlaceNewCard: (cardInHandPosition: number) => void;
}) {
  const { setSelectedCard, unselectCard } = useGameInterface();
  const dragControls = useDragControls();
  const playerMana = useGameStore((s) => s.state.playerMana);

  function onUnselectCard() {
    userPlaceNewCard(position!);
    unselectCard();
  }

  function onSelectCard() {
    setSelectedCard(position!);
  }

  return (
    <motion.div
      className="w-fit h-fit bg-black rounded-sm relative select-none"
      drag={card.cost <= playerMana}
      dragSnapToOrigin
      onDragStart={onSelectCard}
      onDragEnd={onUnselectCard}
      whileDrag={{ zIndex: 9999, scale: 1.2, pointerEvents: "none", }}
      dragControls={dragControls}
    >
      <CardBorder rarity={card.rarity} size={1.8}>
        <InHandCardIllustration card={card} />
      </CardBorder>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-75">
        <ManaBall mana={card.cost} />
      </div>
    </motion.div>
  );
}

const manaFrames = manaSpeed / FRAME_TIME;

function InHandCardIllustration({ card }: { card: CardType }) {
  const animationRef = useGameAnimation<GameStateObject>({
    tl: (ref) => animationTimeline(card.cost * manaFrames).add(ref, { scaleY: 1, }, { values: { scaleY: 0 } }),
    getProgress: (state, currentTick) => {
      if (card.cost !== null && state.playerMana > card.cost || state.playerTickStartEarningMana === null) {
        return -1;
      }
      return (state.playerMana * manaFrames) + (currentTick - state.playerTickStartEarningMana!);
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
