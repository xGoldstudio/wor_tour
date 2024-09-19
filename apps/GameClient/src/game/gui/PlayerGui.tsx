import HpBar from "./HpBar";
import useGameStore from "@/game/stores/gameStateStore";
import StaticCard from "./card/StaticCard";
import { useShallow } from "zustand/react/shallow";
import _ from "lodash";
import { useState } from "react";
import { dummyCard } from "./card/const";
import {
  Borders,
  CardIllustartion,
  GameTimer,
  ManaBar,
  useGameEventListener,
} from "@repo/ui";
import { CardType } from "@repo/lib";
import { ClockReturn, EventType, GameStateObject } from "game_engine";
import InHandCard from "./card/InHandCard";

interface PlayerGUIProps {
  isPlayer: boolean;
  clock: ClockReturn<EventType>;
  gameState: GameStateObject;
}

function PlayerGUI({ isPlayer, clock, gameState }: PlayerGUIProps) {
  const { deck, maxHp } = useGameStore(
    useShallow((s) => ({
      deck: s.state.playerDeck,
      maxHp: isPlayer ? s.state.playerMaxHp : s.state.opponentMaxHp,
    }))
  );

  return (
    <div className="relative z-10 flex justify-center">
      <div className="relative max-w-[900px] w-full">
        <div className="top-0 left-0 w-full h-full absolute bg-gray-500 opacity-60"></div>
        <div className="flex">
          <div
            className="w-full flex flex-col px-6 py-4 items-center"
            id={getPlayerGuiId(isPlayer)}
          >
            {isPlayer && (
              <div className="flex gap-4 mb-3 h-[120px] -translate-y-1/3 z-10">
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
                  <InHandCard
                    position={index}
                    clock={clock}
                    key={index}
                    gameState={gameState}
                  />
                ))}
              </div>
            )}
            {isPlayer && <ManaBar />}
            <div id={`hpBar_${isPlayer}`} className="w-full">
              <HpBar maxHp={maxHp} withHeart isPlayer={isPlayer} />
            </div>
            {!isPlayer ? (
              <>
                <div className="pt-2"></div>
                <div className="absolute bottom-0 translate-y-1/2">
                  <Borders
                    width={900}
                    height={8}
                    borderUnit={0.8}
                    rarity={"epic"}
                  >
                    <CardIllustartion width={900} height={8} borderUnit={0.6}>
                      <></>
                    </CardIllustartion>
                  </Borders>
                </div>
                <div className="absolute bottom-0 translate-y-1/2">
                  <GameTimer />
                </div>
              </>
            ) : (
              <div className="absolute top-0 -translate-y-1/2">
                <Borders
                  width={900}
                  height={8}
                  borderUnit={0.8}
                  rarity={"epic"}
                >
                  <CardIllustartion width={900} height={8} borderUnit={0.6}>
                    <></>
                  </CardIllustartion>
                </Borders>
              </div>
            )}
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
  const [card, setCard] = useState<CardType>(
    useGameStore.getState().state.playerDeck[position] || dummyCard
  );

  useGameEventListener({
    type: "drawCard",
    action: (_, data) => setNewCard(data),
  });

  useGameEventListener({
    type: "shuffleDeck",
    action: (_, data) => setNewCard(data),
  });

  function setNewCard(data: GameStateObject) {
    const currentCard = data.playerDeck[position];
    if (!currentCard) return;
    setCard(currentCard);
  }

  return <StaticCard card={card} />;
}
