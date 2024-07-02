import HpBar from "./HpBar";
import ManaBar from "./ManaBar";
import useGameStore from "@/game/stores/gameStateStore";
import InHandCard, { dummyCard } from "./card/InHandCard";
import StaticCard from "./card/StaticCard";
import { CardType } from "@repo/ui";
import { useShallow } from "zustand/react/shallow";
import _ from "lodash";
import { useState } from "react";
import useGameEventListener from "../gameBehavior/useGameEventListener";

interface PlayerGUIProps {
  isPlayer: boolean;
}

function PlayerGUI({ isPlayer }: PlayerGUIProps) {
  const { deck, maxHp } = useGameStore(
    useShallow((s) => ({
      deck: s.state.playerDeck,
      maxHp: isPlayer ? s.state.playerMaxHp : s.state.opponentMaxHp,
    }))
  );

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
              <div
                id="staticCardWrapper"
                className="relative w-[113px] h-[160px] translate-y-[12%]"
              >
                {_.times(4).map((index) => (
                  <div
                    className="staticCard absolute"
                    style={{
                      top: `${(-3 + index) * 5}px`,
                      left: `${(-3 + index) * 5}px`,
                      zIndex: deck.length - index,
                    }}
                    key={`${index}`}
                  >
                    <GuiDeckCard position={index} />
                  </div>
                ))}
              </div>
              {_.times(4).map((index) => (
                <InHandCard position={index} key={index} />
              ))}
            </div>
          )}
          {isPlayer && <ManaBar />}
          <div id={`hpBar_${isPlayer}`} className="w-full">
            <HpBar maxHp={maxHp} withHeart isPlayer={isPlayer} />
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

function GuiDeckCard({ position }: { position: number }) {
  const [card, setCard] = useState<CardType>(useGameStore.getState().state.playerDeck[position] || dummyCard);

  useGameEventListener({
    type: "drawCard",
    action: (_, data) => {
      const currentCard = data.playerDeck[position];
      if (!currentCard) return;
      setCard(currentCard);
    },
  });

  return (
    <StaticCard card={card} />
  )
}