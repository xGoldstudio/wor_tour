import { useEffect } from "react";
import Card from "../Card";
import findCard, { CardType } from "../cards";
import TargetLine from "./TargetLine";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore from "@/stores/gameStateInterface";
import useGameEvents from "./useGameEvents";
import PlayerGUI from "./PlayerGui";

export default function Game() {
  const {
    playerHand,
    playerMana,
    playerHp,
    playerMaxHp,
    opponentHp,
    opponentMana,
    opponentMaxHp,
  } = useGameStore();

  // function updateManaProgress(player: PlayerState): PlayerState {
  // 	const nextManaProgress = player.mana === 9 ? 0 : player.manaProgress + 1;
  // 	const nextMana = nextManaProgress > 100 ? player.mana + 1 : player.mana;
  // 	return {
  // 		...player,
  // 		mana: nextMana > 9 ? 9 : nextMana,
  // 		manaProgress: nextManaProgress > 100 ? 0 : nextManaProgress,
  // 	}
  // }

 const { userPlaceNewCard } = useGameEvents();

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="h-screen flex flex-col gap-4 items-center justify-center">
        <PlayerGUI mana={opponentMana} hp={opponentHp} maxHp={opponentMaxHp} isPlayer={false} />
        <div className="flex gap-4">
          <CardPlaceholder position={0} />
          <CardPlaceholder position={1} />
          <CardPlaceholder position={2} />
          <CardPlaceholder position={3} />
        </div>
        <p>Vs</p>
        <div className="flex gap-4">
          <CardPlaceholder position={0} isPlayer />
          <CardPlaceholder position={1} isPlayer />
          <CardPlaceholder position={2} isPlayer />
          <CardPlaceholder position={3} isPlayer />
        </div>
        <div className="flex gap-4">
          {playerHand.map((cardId: number, index: number) => (
            <CardWrapper
              card={findCard(cardId)}
              mana={playerMana}
              position={index}
              key={cardId}
							userPlaceNewCard={userPlaceNewCard}
            />
          ))}
        </div>
        <PlayerGUI mana={playerMana} hp={playerHp} maxHp={playerMaxHp} isPlayer />
      </div>
    </div>
  );
}

interface CardPlaceholderProps {
  position: number;
  isPlayer?: boolean;
}

function CardPlaceholder({ position, isPlayer }: CardPlaceholderProps) {
  const { cardTarget, setCardTarget, removeCardTarget } = useGameInterface();
  const isTarget = cardTarget === position && isPlayer;
  const { getBoardCurrentCard } = useGameStore();
  const currentCard = getBoardCurrentCard(!!isPlayer, position);

  function onMouseEnter() {
    if (isPlayer) {
      setCardTarget(position);
    }
  }

  function onMouseLeave() {
    if (isTarget) {
      removeCardTarget();
    }
  }

  return (
    <div
      className="w-[192px] h-[192px] border-2 rounded-md ring-2 ring-black overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        boxShadow: isTarget ? "0px 0px 5px 1px rgba(0,0,0,0.75)" : "none",
				borderColor: currentCard ? "black" : "#cbd5e1"
      }}
    >
      {currentCard ? (
				<div className="flex flex-col items-center h-full">
					<div className="grow flex items-center">{currentCard.dmg}</div>
					<div
						className="w-full h-[120px] border-y-[1px] border-black "
						style={{
							backgroundImage: `url('./${currentCard.id}.png')`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					/>
					<div className="grow flex items-center bg-red-600 w-full justify-center text-white">{currentCard.hp}/{currentCard.maxHp}</div>
				</div>
      ) : (
        <></>
      )}
    </div>
  );
}

interface CardWrapperProps {
  card: CardType;
  mana: number;
  position: number;
	userPlaceNewCard: (cardId: number) => void;
}

function CardWrapper({ card, mana, position, userPlaceNewCard }: CardWrapperProps) {
  const { cardSelected, setSelectedCard, unselectCard } = useGameInterface();
  const isSelected = cardSelected === position;

	function onUnselectCard() {
		unselectCard();
		userPlaceNewCard(card.id);
	}

  useEffect(() => {
    if (isSelected) {
      window.addEventListener("mouseup", onUnselectCard);
      return () => window.removeEventListener("mouseup", onUnselectCard);
    }
  }, [isSelected, unselectCard]);

  function onMouseDown() {
    if (mana >= card.cost) {
      setSelectedCard(position);
    }
  }

  return (
    <div
      className="relative w-[192px] h-[267px]"
      style={{ opacity: mana >= card.cost ? "100%" : "50%" }}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          transform: isSelected ? "scale(1.005) translateY(-10px)" : "scale(1)",
          boxShadow: isSelected ? "0px 0px 5px 1px rgba(0,0,0,0.75)" : "none",
        }}
        className="relative z-10 rounded-md transition-all"
      >
        <Card card={card} />
      </div>
      {isSelected && <TargetLine />}
    </div>
  );
}
