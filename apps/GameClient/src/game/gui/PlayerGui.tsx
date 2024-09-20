import HpBar from "./HpBar";
import useGameStore from "@/game/stores/gameStateStore";
import StaticCard from "./card/StaticCard";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { dummyCard } from "./card/const";
import { GameTimer, ManaBar, useGameEventListener } from "@repo/ui";
import { CardType, textureByRarity } from "@repo/lib";
import { ClockReturn, EventType, GameStateObject } from "game_engine";
import HandCardResizer from "./HandCardResizer";

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
        <div className="top-0 left-0 w-full h-full absolute bg-gray-500 opacity-50"></div>
        <div className="flex">
          <div
            className="w-full flex flex-col px-6 py-4 items-center"
            id={getPlayerGuiId(isPlayer)}
          >
            {isPlayer && (
              <div className="mb-3 -translate-y-1/3 z-10 w-full">
                <HandCardResizer clock={clock} gameState={gameState} deck={deck} />
              </div>
            )}
            {isPlayer && <ManaBar />}
            <div id={`hpBar_${isPlayer}`} className="w-full">
              <HpBar maxHp={maxHp} withHeart isPlayer={isPlayer} />
            </div>
            {!isPlayer ? (
              <>
                <div className="h-[16px]"></div>
                <>
                  <svg
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 rounded-t-sm brightness-75 rounded-b-sm"
                  >
                    <mask id="guiOpponent">
                      <rect
                        fill="#ffffff"
                        x={0}
                        y={0}
                        width="100%"
                        height="100%"
                      />
                      <rect
                        fill="black"
                        x={8}
                        y={0}
                        width="calc(100% - 16px)"
                        height="calc(100% - 8px)"
                      />
                    </mask>
                    <rect
                      fill="black"
                      x={0}
                      y={0}
                      width="100%"
                      height="100%"
                      mask="url(#guiOpponent)"
                    />
                    <image
                      className="blur-[6px]"
                      href={textureByRarity("legendary")}
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      preserveAspectRatio="xMidYMid slice"
                      mask="url(#guiOpponent)"
                    />
                  </svg>
                </>
                <div className="absolute bottom-[4px] translate-y-1/2">
                  <GameTimer />
                </div>
              </>
            ) : (
              <>
                <svg
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0 rounded-t-sm brightness-75"
                >
                  <mask id="guiPlayer">
                    <rect
                      fill="#ffffff"
                      x={0}
                      y={0}
                      width="100%"
                      height="100%"
                    />
                    <rect
                      fill="black"
                      x={8}
                      y={8}
                      width="calc(100% - 16px)"
                      height="100%"
                    />
                  </mask>
                  <rect
                    fill="black"
                    x={0}
                    y={0}
                    width="100%"
                    height="100%"
                    mask="url(#guiPlayer)"
                  />
                  <image
                    className="blur-[6px]"
                    href={textureByRarity("legendary")}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                    mask="url(#guiPlayer)"
                  />
                </svg>
              </>
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

export function GuiDeckCard({ position, size }: { position: number, size: number }) {
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

  return <StaticCard card={card} size={1.35 * size} />;
}
