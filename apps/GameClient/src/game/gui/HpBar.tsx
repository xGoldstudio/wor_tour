import { useRef, useState } from "react";
import { cn, EmptyBar, useGameEventListener, useSyncGameAnimation } from "@repo/ui";
import { PlayerDamageResolveEvent } from "game_engine";
import { animationTimeline, numberWithCommas } from "@repo/lib";
import PlayerHeart from "./PlayerHeart";

interface HpBarProps {
  maxHp: number;
  withHeart?: boolean;
  isPlayer: boolean;
}

function HpBar({ isPlayer, maxHp, withHeart }: HpBarProps) {
  const [hp, setHp] = useState(maxHp);
  const hpBarRef = useRef<HTMLDivElement | null>(null);
  const bloodRef = useRef<HTMLDivElement | null>(null);
  const scope = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();

  useGameEventListener({
    type: "playerDamageResolve",
    action: (_, state) => {
      const nextHp = isPlayer ? state.playerHp : state.opponentHp;
      setHp(nextHp);
      if (scope.current && hpBarRef.current) {
        const lifeBar = scope.current.querySelector<HTMLElement>(".lifeBar");
        if (lifeBar) {
          lifeBar.style.transform = `scaleX(${Math.max(0, nextHp / maxHp)})`;
        }
        hpBarRef.current.innerHTML = numberWithCommas(nextHp);
        triggerAnimation({
          duration: 50,
          computeStyle: animationTimeline(50)
            .add(hpBarRef.current, { scaleX: 1 }, [
              {
                values: { scaleX: 1.2 },
                ease: [0, 1, 1, 1],
              },
              {
                values: { scaleX: 0.85 },
                from: -30,
                ease: [0, 1, 1, 1],
              },
              {
                values: { scaleX: 1 },
                from: -15,
                ease: [0, 0.42, 1, 1],
              },
            ])
            .add(
              bloodRef.current,
              {
                opacity: 0,
              },
              [
                { values: { opacity: 60 }, to: 20, ease: [0, 0.42, 1, 1] },
                { values: { opacity: 0 }, ease: [0, 0.42, 1, 1] },
              ]
            )
            .add(
              scope.current,
              { scaleX: 1 },
              [
                {
                  values: { scaleX: 1.02 },
                  ease: [0, 1, 1, 1],
                },
                {
                  values: { scaleX: 0.98 },
                  from: -30,
                  ease: [0, 1, 1, 1],
                },
                {
                  values: { scaleX: 1 },
                  from: -15,
                  ease: [0, 0.42, 1, 1],
                },
              ]
            ).progress,
        });
      }
    },
    filter: (event) => (event as PlayerDamageResolveEvent).initiator.isPlayer === isPlayer,
  });

  return (
    <div
      ref={scope}
      className={cn(
        "shadow-md grid grid-cols-1 text-sm relative ",
        !!withHeart && "my-[6px] ml-[20px]"
      )}
    >
      {!!withHeart && (
        <PlayerHeart isPlayer={isPlayer} />
      )}
      <EmptyBar>
        <div className="lifeBar w-full h-full absolute origin-left bg-gradient-to-b  from-[#0fad05] via-[#74cc6f] via-[37%] to-[#0fad05]" />
        <div
          className="damageFlashBar w-full h-full absolute origin-left bg-gradient-to-b  from-[#FF0000] via-[#ff6e6e] via-[37%] to-[#FF0000] opacity-0"
          ref={bloodRef}
        />
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#2105ad] via-[#4b429d] via-[37%] to-[#2105ad] opacity-0"
        />
        <p
          className="text-xl text-center text-white font-[stylised] relative"
          ref={hpBarRef}
        >
          {numberWithCommas(hp)}
        </p>
      </EmptyBar>
    </div>
  );
}

export default HpBar;
