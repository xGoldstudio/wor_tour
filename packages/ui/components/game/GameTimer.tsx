import { useRef } from "react";
import useGameEventListener from "../card/useGameEventListener";
import { MAX_GAME_DURATION } from "game_engine";
import {
	Borders, CardIllustartion,
	InnerBord
} from "../card/CardBorder";
import { textureByRarity } from "@repo/lib";

export default function GameTimer() {
  const timerRef = useRef<HTMLParagraphElement>(null);

  useGameEventListener({
    type: "timerDecrease",
    action: (_, gameState) => {
      if (timerRef.current) {
        const timer = gameState.getTimer();
        timerRef.current.textContent = timer.toString();
				if (timer === 0) {
					timerRef.current.style.color = "red";
				}
      }
    },
  });

  const width = 80;

  return (
    <Borders width={width} height={40} borderUnit={0.8} rarity={"epic"}>
      <CardIllustartion width={width} height={40} borderUnit={0.6}>
        <InnerBord size={1}>
          <div className="w-full h-full flex justify-center items-center font-semibold relative bg-black overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full blur-sm"
              style={{ backgroundImage: `url(${textureByRarity("rare")})` }}
            />
            <p ref={timerRef} className="relative">{MAX_GAME_DURATION}</p>
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}
