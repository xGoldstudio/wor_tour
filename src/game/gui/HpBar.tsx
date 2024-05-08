import useGameStore from "@/stores/gameStateInterface";
import { useAnimate } from "framer-motion";
import { useState } from "react";
import { EmptyBar } from "./ManaBar";

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface HpBarProps {
  hp: number;
  maxHp: number;
  isPlayer: boolean;
}

function HpBar({ hp, maxHp, isPlayer }: HpBarProps) {
  const currentHp = useGameStore((state) =>
    isPlayer ? state.playerHp : state.opponentHp
  );
  const [oldHp, setOldHp] = useState(currentHp);

  const [scope, animate] = useAnimate();
  const [bloodScope, animateBlood] = useAnimate();
  const [canAnimate, setCanAnimate] = useState(true);
  if (oldHp !== currentHp) {
    setOldHp(currentHp);

    if (!canAnimate) return;
    setCanAnimate(false);
    animate(
      scope.current,
      {
        x: [0, 4, -4, 4, -4, 0],
      },
      { duration: 0.5 }
    ).then(() => {
      setCanAnimate(true);
    });
    animateBlood(
      bloodScope.current,
      {
        opacity: [0, 0.6, 0],
      },
      { duration: 0.5 }
    );
  }

  return (
    <div
      ref={scope}
      className="shadow-md grid grid-cols-1 text-sm relative my-[6px] ml-[20px]"
    >
      <img
        className="absolute z-10 left-[-20px] top-[-6px]"
        src="/heart.svg"
        width={40}
        height={40}
      />
      <EmptyBar>
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#0fad05] via-[#74cc6f] via-[37%] to-[#0fad05] transition-transform duration-500"
          style={{ transform: `scaleX(${hp > 0 ? (hp / maxHp) * 100 : 0}%)` }}
        />
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#FF0000] via-[#ff6e6e] via-[37%] to-[#FF0000] transition-transform duration-500 opacity-0"
          ref={bloodScope}
        />
        <p className="text-xl text-center text-white font-[stylised] relative">
          {numberWithCommas(hp)}
        </p>
      </EmptyBar>
    </div>
  );
}

export default HpBar;
