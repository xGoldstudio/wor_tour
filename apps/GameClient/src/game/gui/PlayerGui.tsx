import HpBar from "./HpBar";
import ManaBar from "./ManaBar";
import useGameStore from "@/game/stores/gameStateStore";
import InHandCard from "./card/InHandCard";
import StaticCard from "./card/StaticCard";
import { CardType } from "@repo/ui";
import { useShallow } from "zustand/react/shallow";

interface PlayerGUIProps {
  isPlayer: boolean;
  userPlaceNewCard: (cardInHandPosition: number) => void;
}

function PlayerGUI({ isPlayer, userPlaceNewCard }: PlayerGUIProps) {
  const { deck, hand, hp, maxHp } = useGameStore(
    useShallow((s) => ({
      deck: s.state.playerDeck,
      hand: s.state.playerHand,
      mana: isPlayer ? s.state.playerMana : s.state.opponentMana,
      hp: isPlayer ? s.state.playerHp : s.state.opponentHp,
      maxHp: isPlayer ? s.state.playerMaxHp : s.state.opponentMaxHp,
    }))
  );

  const playerHandSanitized = hand.filter(
    (card) => card !== null
  ) as CardType[];

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
                {reverseDeck.map((card, index) => (
                  <div
                    className="absolute"
                    style={{ top: `${-index * 5}px`, left: `${-index * 5}px` }}
                    key={`${card.id}_${index}`}
                  >
                    <StaticCard card={card} />
                  </div>
                ))}
              </div>
              {playerHandSanitized?.map((card, index) => (
                <InHandCard
                  card={card}
                  position={index}
                  key={`${card.id}_${index}`}
                  userPlaceNewCard={userPlaceNewCard}
                />
              ))}
            </div>
          )}
          {isPlayer && <ManaBar />}
          <div id={`hpBar_${isPlayer}`} className="w-full">
            <HpBar hp={hp} maxHp={maxHp} withHeart isPlayer={isPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getPlayerGuiId(isPlayer: boolean) {
  return `gui_${isPlayer ? "player" : "opponent"}`;
}

export default PlayerGUI;
