import { useAnimate } from "framer-motion";
import { useState } from "react";
import { EmptyBar } from "./ManaBar";
import { cn, numberWithCommas } from "@repo/ui";

interface HpBarProps {
  hp: number;
  maxHp: number;
  withHeart?: boolean;
}

function HpBar({ hp, maxHp, withHeart }: HpBarProps) {
  const [oldHp, setOldHp] = useState(hp);

  const [scope, animate] = useAnimate();
  const [bloodScope, animateBlood] = useAnimate();
  const [healScope, animateHeal] = useAnimate();
  const [canAnimate, setCanAnimate] = useState(true);
  if (oldHp !== hp) {
    setOldHp(hp);

    if (!canAnimate) return;
    setCanAnimate(false);
    if (withHeart) {
      animate(
        scope.current,
        {
          x: [0, 4, -4, 4, -4, 0],
        },
        { duration: 0.5 },
      );
    }
    if (hp > oldHp) {
      animateHeal(
        healScope.current,
        {
          opacity: [0, 0.6, 0],
        },
        { duration: 0.5 },
      ).then(() => {
        setCanAnimate(true);
      });
    } else {
      animateBlood(
        bloodScope.current,
        {
          opacity: [0, 0.6, 0],
        },
        { duration: 0.5 },
      ).then(() => {
        setCanAnimate(true);
      });
    }
  }

  return (
    <div
      ref={scope}
      className={cn(
        "shadow-md grid grid-cols-1 text-sm relative ",
        !!withHeart && "my-[6px] ml-[20px]",
      )}
    >
      {!!withHeart && (
        <img
          className="absolute z-10 left-[-20px] top-[-6px]"
          src="/heart.svg"
          width={40}
          height={40}
        />
      )}
      <EmptyBar>
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#0fad05] via-[#74cc6f] via-[37%] to-[#0fad05] transition-transform duration-500"
          style={{ transform: `scaleX(${hp > 0 ? (hp / maxHp) * 100 : 0}%)` }}
        />
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#FF0000] via-[#ff6e6e] via-[37%] to-[#FF0000] transition-transform duration-500 opacity-0"
          ref={bloodScope}
        />
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#2105ad] via-[#4b429d] via-[37%] to-[#2105ad] transition-transform duration-500 opacity-0"
          ref={healScope}
        />
        <p className="text-xl text-center text-white font-[stylised] relative">
          {numberWithCommas(hp)}
        </p>
      </EmptyBar>
    </div>
  );
}

export default HpBar;
