import _ from "lodash";
import InHandCard, {
  HAND_CARD_RATIO as HAND_CARD_RATIO,
} from "./card/InHandCard";
import {
  CARD_IN_HAND,
  ClockReturn,
  EventType,
  GameStateObject,
} from "game_engine";
import { useEffect, useRef, useState } from "react";
import {
  CARD_BORDER_HEIGHT,
  CARD_BORDER_WIDTH,
  useOnMount,
  useOnUnMount,
} from "@repo/ui";
import { GuiDeckCard } from "./PlayerGui";
import { CardType, inPx } from "@repo/lib";

interface HandCardResizerProps {
  clock: ClockReturn<EventType>;
  gameState: GameStateObject;
  deck: CardType[];
}

const GAP = 16;

export default function HandCardResizer({
  clock,
  gameState,
  deck,
}: HandCardResizerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(1);

  useEffect(() => {
    resize();
  }, [wrapperRef.current]);

  function resize() {
    const spaceAvailable =
      (wrapperRef.current?.clientWidth ?? 0) -
      GAP * 5 -
      1.35 * CARD_BORDER_WIDTH;
    const sizeForOne = spaceAvailable / CARD_IN_HAND;
    setSize(Math.min(sizeForOne / (CARD_BORDER_WIDTH * HAND_CARD_RATIO), 1));
  }

  useOnMount(() => {
    window.addEventListener("resize", resize);
  });

  useOnUnMount(() => {
    window.removeEventListener("resize", resize);
  });

  return (
    <div
      className={`max-w-full flex justify-between`}
      ref={wrapperRef}
      style={{ height: CARD_BORDER_HEIGHT * HAND_CARD_RATIO * size * 0.77 }} // 0.77 is 1 - 0.33 wich is the translated y value
    >
      <div
        id="staticCardWrapper"
        className="relative translate-y-[20%]"
        style={{
          width: 1.35 * CARD_BORDER_WIDTH * size,
          height: 1.35 * CARD_BORDER_HEIGHT,
          marginLeft: GAP,
        }}
      >
        {_.times(4).map((index) => (
          <div
            className="staticCard absolute"
            style={{
              top: `${(-3 + index) * 5 * size}px`,
              left: `${(-3 + index) * 5 * size}px`,
              zIndex: deck.length - index,
            }}
            key={`${index}`}
          >
            <GuiDeckCard position={index} size={size} />
          </div>
        ))}
      </div>
      <div className={`flex grow justify-center`} style={{ gap: inPx(GAP) }}>
        {_.times(CARD_IN_HAND).map((index) => (
          <div key={`${index}`}>
            <InHandCard
              position={index}
              clock={clock}
              gameState={gameState}
              size={size}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
