import { ChestRewardType } from "@/home/store/rewardStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { chestImageByLevel, emptyChestImageByLevel } from "../home/allWorlds/LevelPreview";

interface GoldRewardProps {
  reward: ChestRewardType;
  removeCurrentReward: () => void;
}

export default function ChestReward({
  reward,
  removeCurrentReward,
}: GoldRewardProps) {
  const scope = useRef<HTMLDivElement>(null);
  const animationOver = useRef<number>(0);

  useGSAP(
    () => {
      if (!scope.current) return;
      const tl = gsap.timeline({
        onComplete: () => {
          animationOver.current = 1;
        },
      });
      tl.fromTo(
        scope.current.querySelector("img"),
        { scale: 0 },
        { scale: 1, duration: 1.5, ease: "elastic" },
        "start"
      );
    },
    { scope, dependencies: [reward] }
  );

  return (
    <div
      className="h-full flex flex-col justify-center items-center relative"
      ref={scope}
      onClick={() => {
        if (animationOver.current < 3) {
          animationOver.current = animationOver.current + 1;
          if (scope.current) {
            const tl = gsap.timeline({});
            tl.to(scope.current.querySelector("img"), {
              rotate: 25,
              duration: 0.1,
              ease: "power2.in",
            });
            tl.to(scope.current.querySelector("img"), {
              rotate: -25,
              duration: 0.1,
              ease: "power2.in",
            });
            tl.to(scope.current.querySelector("img"), {
              rotate: 0,
              duration: 0.1,
              ease: "power2.in",
            });
          }
        } else if (animationOver.current === 3) {
          animationOver.current = 4;
          if (scope.current) {
            scope.current.querySelector("img")?.setAttribute("src", emptyChestImageByLevel["rare"]);
            const tl = gsap.timeline({
              onComplete: () => {
                removeCurrentReward();
              }
            });
            tl.to(scope.current.querySelector("img"), {
              y: 100,
              opacity: 0,
              duration: 0.8,
              ease: "power2.in",
            });
          }
        }
      }}
    >
      <img
        src={chestImageByLevel["rare"]}
        alt="money"
        className="w-[300px] h-[300px]"
      />
    </div>
  );
}
