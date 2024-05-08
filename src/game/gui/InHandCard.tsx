import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore from "@/stores/gameStateInterface";
import { motion, useAnimate, useDragControls } from "framer-motion";
import { ManaBall } from "./ManaBar";
import { useEffect, useState } from "react";
import { manaSpeed } from "../gameBehavior/useGameEvents";
import { CardType } from "@/cards";

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
    unselectCard();
    userPlaceNewCard(position!);
  }

  function onSelectCard() {
    setSelectedCard(position!);
  }

  const borderTextureRarity = {
    common: "bronze.avif",
    rare: "silver.jpeg",
    epic: "gold.jpeg",
    legendary: "diamond.avif",
  };

  return (
    <motion.div
      className="w-[113px] h-[160px] bg-black rounded-sm relative select-none"
      drag={usable && card.cost <= playerMana}
      dragSnapToOrigin
      onDragStart={onSelectCard}
      onDragEnd={onUnselectCard}
      whileDrag={{ zIndex: 9999, scale: 1.2 }}
      dragControls={dragControls}
    >
      <div className="w-full h-full rounded-sm overflow-hidden relative">
        <div className="rounded-sm w-[113px] h-[160px] absolute top-[0px] left-[0px] overflow-hidden">
          <div
            className="w-full h-full blur-[1px]"
            style={{
              backgroundImage: `url(/${borderTextureRarity[card.rarity]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="h-[154px] w-[3px] bg-black opacity-20 absolute top-[3px] left-0"></div>
        <div className="w-[110px] h-[3px] bg-black opacity-20 absolute top-0 left-0"></div>
        <div className="w-full h-[4px] bg-black opacity-60 absolute bottom-0 left-0"></div>
        <div className="h-[157px] w-[3px] bg-black opacity-60 absolute top-0 right-0"></div>
        <CardIllustartion
          cardId={card.id}
          currentMana={playerMana}
          manaCost={usable ? card.cost : null}
        />
      </div>
      {usable && (
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-75">
          <ManaBall mana={card.cost} />
        </div>
      )}
    </motion.div>
  );
}

function CardIllustartion({
  cardId,
  manaCost,
  currentMana,
}: {
  cardId: number;
  manaCost: number | null;
  currentMana: number;
}) {
  const [scope, animate] = useAnimate();
  const [lastMana, setLastMana] = useState(currentMana);
  const playerTimestampStartEarningMana = useGameStore(
    (state) => state.playerTimestampStartEarningMana
  );

  if (currentMana !== lastMana) {
    setLastMana(currentMana);
    if (
      manaCost !== null &&
      playerTimestampStartEarningMana !== null &&
      currentMana < lastMana &&
      currentMana < manaCost
    ) {
      computeAnimation(manaCost, playerTimestampStartEarningMana);
    }
  }

  useEffect(() => {
    if (
      manaCost !== null &&
      playerTimestampStartEarningMana !== null
    ) {
      computeAnimation(manaCost, playerTimestampStartEarningMana);
    }
  }, [playerTimestampStartEarningMana]);

  function computeAnimation(
    manaCost: number,
    playerTimestampStartEarningMana: number
  ) {
    const runningManaEarningProgress =
      (new Date().getTime() - playerTimestampStartEarningMana) / manaSpeed;
    const alreadyProgress =
      (currentMana + runningManaEarningProgress) / manaCost; // normalized value [0,1]
    const animationTime =
      (manaCost * manaSpeed - alreadyProgress * manaCost * manaSpeed) / 1000;
    animate(
      scope.current,
      {
        scaleY: [`${100 - alreadyProgress * 100}%`, "0%"],
      },
      { duration: animationTime, ease: "linear" }
    );
  }

  return (
    <div className="w-[97px] h-[143px] absolute top-[8px] left-[7px] rounded-[2px] overflow-hidden">
      <div className="w-full h-[4px] bg-black opacity-60 absolute bottom-0 top-0"></div>
      <div className="h-full w-[3px] bg-black opacity-60 absolute top-[4px] left-0"></div>
      <div className="w-[94px] h-[3px] bg-black opacity-20 absolute bottom-0 left-[3px]"></div>
      <div className="h-[136px] w-[2px] bg-black opacity-20 absolute top-[4px] right-0"></div>
      <div
        className="w-[92px] h-[136px] top-[4px] left-[3px] absolute"
        style={{
          backgroundImage: `url(/${cardId}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      {manaCost !== null && (
        <div
          ref={scope}
          className="absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top ease-linear transition-transform"
        />
      )}
    </div>
  );
}

export default InHandCard;