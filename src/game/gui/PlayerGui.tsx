import HpBar from "./HpBar";
import ManaBar from "./ManaBar";
import useGameStore from "@/stores/gameStateInterface";
import findCard from "@/cards";
import InHandCard from "./card/InHandCard";
import StaticCard from "./card/StaticCard";

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
  const { deck, hand } = useGameStore((state) => ({
    deck: isPlayer ? state.playerDeck : state.opponentDeck,
    hand: isPlayer ? state.playerHand : state.opponentHand,
  }));

  const playerHandSanitized = hand.find((id) => id === null)
    ? null
    : (hand as number[]);

  const reverseDeck = [...deck].reverse();

  return (
    <div className="relative">
      <div className="top-0 left-0 w-full h-full absolute bg-gray-500 opacity-80"></div>
      <div className="flex">
        <div
          className="w-full flex flex-col px-6 py-4 items-center"
          id={getPlayerGuiId(isPlayer)}
        >
          {isPlayer && (
            <div className="flex gap-4 mb-3 h-[120px] -translate-y-1/3">
              <div className="relative w-[113px] h-[160px] translate-y-[12%]">
                {reverseDeck.map((cardId, index) => (
                  <div
                    className="absolute"
                    style={{ top: `${-index * 5}px`, left: `${-index * 5}px` }}
                    key={`${cardId}_${index}`}
                  >
                    <StaticCard card={findCard(cardId)} />
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
          <div id={`hpBar_${isPlayer}`} className="w-full">
            <HpBar hp={hp} maxHp={maxHp} withHeart />
          </div>
        </div>
      </div>
    </div>
  );
}

export function getPlayerGuiId(isPlayer: boolean) {
  return `gui_${isPlayer ? "player" : "opponent"}`;
}

export default PlayerGUI;
