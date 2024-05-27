import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore, { GameStore } from "@/game/stores/gameStateInterface";
import { motion, useDragControls } from "framer-motion";
import { ManaBall } from "../ManaBar";
import { FRAME_TIME, manaSpeed } from "../../gameBehavior/useGameEvents";
import { CardType } from "@/cards";
import { useGameAnimation } from "../../gameBehavior/animation/useGameSyncAnimation";
import CardBorder, { CardContentIllustartion } from "./CardBorder";

function InHandCard({
  card,
  position,
  userPlaceNewCard,
}: {
  card: CardType;
  position?: number;
  userPlaceNewCard: (cardInHandPosition: number) => void;
}) {
  const dragControls = useDragControls();

  const { setSelectedCard, unselectCard } = useGameInterface();
  const { playerMana } = useGameStore();

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
      whileDrag={{ zIndex: 9999, scale: 1.2 }}
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

function InHandCardIllustration({ card }: { card: CardType }) {
  const animationRef = useGameAnimation<GameStore & { currentTick: number }>(
    (state) => {
      if (card.cost !== null && state.playerMana >= card.cost) {
        return {
          transform: `scaleY(0%)`,
        };
      }
      const runningManaEarningProgress =
        (state.currentTick - state.playerTickStartEarningMana!) /
        (manaSpeed / FRAME_TIME);
      const alreadyProgress =
        (state.playerMana + runningManaEarningProgress) / (card.cost || 0);

      return {
        transform: `scaleY(${100 - alreadyProgress * 100}%)`,
      };
    }
  );

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
