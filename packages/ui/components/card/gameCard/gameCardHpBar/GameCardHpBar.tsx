import { useRef, useState } from "react";
import { useSyncGameAnimation } from "../../useGameSyncAnimation";
import useGameEventListener from "../../useGameEventListener";
import { AfterPlaceCardEvent, CardDamagResolveEvent, GameStateObject, HealCardEvent } from "game_engine";
import { animationTimeline, numberWithCommas } from "@repo/lib";
import EmptyBar from "../../../EmptyBar";

export default function GameCardHpBar({
  position,
  isPlayerCard,
  trackedInstanceId,
}: {
  position: number;
  isPlayerCard: boolean;
  trackedInstanceId: React.MutableRefObject<number | null>;
}) {
  const [hp, setHp] = useState(0);
  const hpBarRef = useRef<HTMLDivElement | null>(null);
  const scope = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();

  useGameEventListener<AfterPlaceCardEvent>({
    type: "afterPlaceCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card === null) {
        return;
      }
      setHp(card.hp);
      const lifeBar = scope.current?.querySelector<HTMLElement>(".lifeBar");
      if (lifeBar && hpBarRef.current) {
        lifeBar.style.transform = `scaleX(${card.hp / card.maxHp})`;
        hpBarRef.current.innerHTML = numberWithCommas(card.hp);
      }
    },
    filter: (event) =>
      event.isPlayer === isPlayerCard && event.position === position,
  });

  useGameEventListener({
    type: "cardDamageResolve",
    action: (_, state) => onHpChange(state),
    filter: (event) =>
      (event as CardDamagResolveEvent).initiator.instanceId ===
      trackedInstanceId.current,
  });

  useGameEventListener({
    type: "healCard",
    action: (_, state) => onHpChange(state),
    filter: (event) =>
      (event as HealCardEvent).instanceId === trackedInstanceId.current,
  });

  function onHpChange(state: GameStateObject) {
    const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
      position
    ];
    if (card === null) {
      return;
    }
    const nextHp = card.hp;
    setHp(nextHp);
    if (scope.current && hpBarRef.current) {
      const lifeBar = scope.current.querySelector<HTMLElement>(".lifeBar");
      if (lifeBar) {
        lifeBar.style.transform = `scaleX(${nextHp / card.maxHp})`;
      }
      hpBarRef.current.innerHTML = numberWithCommas(nextHp);
      triggerAnimation({
        replace: true,
        duration: 50,
        computeStyle: animationTimeline(50).add(
          hpBarRef.current,
          { scaleX: 1 },
          [
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
          ]
        ).progress,
      });
    }
  }

  return (
    <div ref={scope} className="shadow-md grid grid-cols-1 text-sm relative ">
      <EmptyBar>
        <div className="lifeBar w-full h-full absolute origin-left bg-gradient-to-b  from-[#0fad05] via-[#74cc6f] via-[37%] to-[#0fad05]" />
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
