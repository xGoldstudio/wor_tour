import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore, { GameStore } from "@/stores/gameStateInterface";
import { motion, useDragControls } from "framer-motion";
import { ManaBall } from "../ManaBar";
import { FRAME_TIME, manaSpeed } from "../../gameBehavior/useGameEvents";
import { CardType } from "@/cards";
import { useGameAnimation } from "../../gameBehavior/animation/useGameSyncAnimation";
import CardBorder from "./CardBorder";

function InHandCard({
  card,
  position,
  userPlaceNewCard,
}: {
  card: CardType;
  position?: number;
  userPlaceNewCard: (cardInHandPosition: number) => void;
}) {
  const usable = position !== undefined;
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
      drag={usable && card.cost <= playerMana}
      dragSnapToOrigin
      onDragStart={onSelectCard}
      onDragEnd={onUnselectCard}
      whileDrag={{ zIndex: 9999, scale: 1.2 }}
      dragControls={dragControls}
    >
      <CardBorder rarity={card.rarity} size={1.8}>
        <CardIllustartion
          cardId={card.id}
          manaCost={usable ? card.cost : null}
        />
      </CardBorder>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-75">
        <ManaBall mana={card.cost} />
      </div>
    </motion.div>
  );
}

function CardIllustartion({
  cardId,
  manaCost,
}: {
  cardId: number;
  manaCost: number | null;
}) {
  const animationRef = useGameAnimation<GameStore & { currentTick: number }>(
    (state) => {
      if (manaCost !== null && state.playerMana >= manaCost) {
        return {
          transform: `scaleY(0%)`,
        };
      }
      const runningManaEarningProgress =
        (state.currentTick - state.playerTickStartEarningMana!) /
        (manaSpeed / FRAME_TIME);
      const alreadyProgress =
        (state.playerMana + runningManaEarningProgress) / (manaCost || 0);
      return {
        transform: `scaleY(${100 - alreadyProgress * 100}%)`,
      };
    }
  );

  return (
    <>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(/${cardId}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div
        ref={animationRef}
        className="absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top"
      />
    </>
  );
}

export default InHandCard;
