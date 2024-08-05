import { startContainerAnimation } from "@/home/animations/Animations";
import { KeysRewardType } from "@/home/store/rewardStore";
import { keysService } from "@/services/inject";
import { MAX_KEYS } from "@/services/KeysService/KeysService";
import { useGSAP } from "@gsap/react";
import { useSafeTimeout } from "@repo/ui";
import gsap from "gsap";
import { useRef } from "react";

interface KeysRewardProps {
  reward: KeysRewardType;
  removeCurrentReward: () => void;
}

export default function KeysReward({
  reward,
  removeCurrentReward,
}: KeysRewardProps) {
  const scope = useRef<HTMLDivElement>(null);
  const animationOver = useRef<false | "appear" | "disapear">(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const safeTimeout = useSafeTimeout();

  useGSAP(
    () => {
      if (!scope.current) return;
      const tl = gsap.timeline({});
      tlRef.current = tl;
      tl.fromTo(
        scope.current.querySelector("img"),
        { scale: 0 },
        { scale: 1, duration: 1.5, ease: "elastic" },
        "start"
      );
      tl.fromTo(
        scope.current.querySelector("p"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            animationOver.current = "appear";
          },
        },
        "start=+0.5"
      );
    },
    { scope, dependencies: [reward] }
  );

  return (
    <div
      className="h-full flex flex-col justify-center items-center relative"
      ref={scope}
      onClick={() => {
        if (animationOver.current === "appear") {
          tlRef.current?.kill();
          if (scope.current) {
            gsap.to(scope.current.querySelector("img"), {
              scale: 0,
              duration: 0.5,
              ease: "power2.in",
            });
            gsap.to(scope.current.querySelector("p"), {
              opacity: 0,
              x: -20,
              duration: 0.5,
              ease: "power2.in",
            });
          }
          animationOver.current = "disapear";
          const keys = keysService.getKeys();
          if (keys === MAX_KEYS) {
            safeTimeout(() => {
              removeCurrentReward();
            }, 700);
            return;
          }
          startContainerAnimation({
            animationObject: {
              type: "keys",
              previousValue: keys,
              amount: MAX_KEYS - keys,
              originRef: scope.current?.querySelector(
                "img"
              ) as HTMLImageElement,
              onEnd: () => {
                removeCurrentReward();
                keysService.setMax();
              },
            },
          });
        }
      }}
    >
      <img src="/key.png" alt="money" className="w-[300px] h-[300px]" />
      <p className="text-5xl font-bold text-white drop-shadow-[2px_2px_2px_black] pb-32">
        Max keys
      </p>
    </div>
  );
}
