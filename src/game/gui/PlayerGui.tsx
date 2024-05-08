import HpBar from "./HpBar";
import ManaBar from "./ManaBar";
import useGameStore from "@/stores/gameStateInterface";
import findCard from "@/cards";
import InHandCard from "./InHandCard";
import { IS_DEBUG } from "../Game";

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
  const { deck, hand } = useGameStore(state => ({
    deck: isPlayer ? state.playerDeck : state.opponentDeck,
    hand: isPlayer ? state.playerHand : state.opponentHand,
  }));

  const playerHandSanitized = hand.find((id) => id === null)
    ? null
    : (hand as number[]);

  const reverseDeck = [...deck].reverse();

  return (
    <div>
      <BorderTop />
      <div className="flex">
        <BorderLeft />
        <div
          className="w-full flex flex-col bg-gray-500 px-6 py-4"
          id={getPlayerGuiId(isPlayer)}
        >
          {(isPlayer || IS_DEBUG) && (
            <div className="flex gap-4 mb-3 h-[120px] -translate-y-1/3">
              <div className="relative scale-75 w-[113px] h-[160px] translate-y-[12%]">
                {reverseDeck.map((cardId, index) => (
                  <div
                    className="absolute"
                    style={{ top: `${-index * 5}px`, left: `${-index * 5}px` }}
                  >
                    <InHandCard
                      card={findCard(cardId)}
                      userPlaceNewCard={userPlaceNewCard}
                    />
                  </div>
                ))}
              </div>
              {playerHandSanitized?.map((cardId, index) => (
                <InHandCard
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
