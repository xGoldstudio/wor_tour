import HpBar from "./HpBar";
import ManaBar, { ManaBall } from "./ManaBar";
import { motion, useAnimate, useDragControls } from "framer-motion";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore from "@/stores/gameStateInterface";
import findCard, { CardType } from "@/cards";
import { manaSpeed } from "../gameBehavior/useGameEvents";
import { useEffect, useState } from "react";

interface PlayerGUIProps {
  mana: number;
  hp: number;
  maxHp: number;
  isPlayer: boolean;
  userPlaceNewCard: (cardInHandPosition: number) => void;
}

function PlayerGUI({
  mana,
  hp,
  maxHp,
  isPlayer,
  userPlaceNewCard,
}: PlayerGUIProps) {
  const { playerDeck, playerHand } = useGameStore();

  const playerHandSanitized = playerHand.find((id) => id === null)
    ? null
    : (playerHand as number[]);

  return (
    <div>
      <BorderTop />
      <div className="flex">
        <BorderLeft />
        <div
          className="w-full flex flex-col bg-gray-500 px-6 py-4"
          id={getPlayerGuiId(isPlayer)}
        >
          {isPlayer && (
            <div className="flex gap-4 mb-3 h-[120px] -translate-y-1/3">
              <div className="relative scale-75 w-[113px] h-[160px] translate-y-[12%]">
                {playerDeck.map((cardId, index) => (
                  <div
                    className="absolute"
                    style={{ top: `${-index * 5}px`, left: `${-index * 5}px` }}
                  >
                    <InGameCard
                      card={findCard(cardId)}
                      userPlaceNewCard={userPlaceNewCard}
                    />
                  </div>
                ))}
              </div>
              {playerHandSanitized?.map((cardId, index) => (
                <InGameCard
                  card={findCard(cardId)}
                  position={index}
                  key={`${cardId}_${index}`}
                  userPlaceNewCard={userPlaceNewCard}
                />
              ))}
            </div>
          )}
          <ManaBar isPlayer={isPlayer} mana={mana} />
          <HpBar isPlayer={isPlayer} hp={hp} maxHp={maxHp} />
        </div>
        <BorderRight />
      </div>
      <BorderBottom />
    </div>
  );
}

function BorderTop() {
  return (
    <div className="w-full relative flex overflow-hidden">
      <div className="w-[12px] h-[12px] bg-[#634c20]"></div>
      <div className="grow overflow-hidden relative">
        <div className="absolute w-full top-[4px] h-[2px] blur-[2px] bg-[#edd7af]"></div>
        <div className="absolute w-full top-[8px] h-[2px] blur-[2px] bg-[#edd7af]"></div>
        <div className="w-full h-[4px] bg-[#e1c185]"></div>
        <div className="w-full h-[6px] bg-[#b4603c]"></div>
        <div className="w-full h-[2px] bg-[#634c20]"></div>
      </div>
      <div className="w-[12px] h-[12px] bg-[#634c20]"></div>
    </div>
  );
}

function BorderBottom() {
  return (
    <div className="w-full relative flex overflow-hidden">
      <div className="w-[12px] h-[12px] bg-[#634c20]"></div>
      <div className="grow overflow-hidden relative">
        <div className="absolute w-full bottom-[4px] h-[2px] blur-[2px] bg-[#edd7af]"></div>
        <div className="absolute w-full bottom-[8px] h-[2px] blur-[2px] bg-[#edd7af]"></div>
        <div className="w-full h-[2px] bg-[#634c20]"></div>
        <div className="w-full h-[6px] bg-[#b4603c]"></div>
        <div className="w-full h-[4px] bg-[#e1c185]"></div>
      </div>
      <div className="w-[12px] h-[12px] bg-[#634c20]"></div>
    </div>
  );
}

function BorderLeft() {
  return (
    <div className="grow flex relative overflow-hidden">
      <div className="h-full w-[4px] bg-[#e1c185]"></div>
      <div className="absolute h-full left-[4px] w-[2px] blur-[2px] bg-[#edd7af]"></div>
      <div className="h-full w-[6px] bg-[#b4603c]"></div>
      <div className="absolute h-full left-[8px] w-[2px] blur-[2px] bg-[#edd7af]"></div>
      <div className="h-full w-[2px] bg-[#634c20]"></div>
    </div>
  );
}

function BorderRight() {
  return (
    <div className="grow flex relative overflow-hidden">
      <div className="absolute h-full right-[4px] w-[2px] blur-[2px] bg-[#edd7af]"></div>
      <div className="absolute h-full right-[8px] w-[2px] blur-[2px] bg-[#edd7af]"></div>
      <div className="h-full w-[2px] bg-[#634c20]"></div>
      <div className="h-full w-[6px] bg-[#b4603c]"></div>
      <div className="h-full w-[4px] bg-[#e1c185]"></div>
    </div>
  );
}

export function getPlayerGuiId(isPlayer: boolean) {
  return `gui_${isPlayer ? "player" : "opponent"}`;
}

export default PlayerGUI;

function InGameCard({
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
      className="w-[113px] h-[160px] bg-black rounded-sm relative"
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
      currentMana === 0 &&
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
          // initial={{ scaleY: "100%" }}
          // animate={{ scaleY: "0%" }}
          // transition={{ duration: animationTime / 1000 }}
        />
      )}
    </div>
  );
}
