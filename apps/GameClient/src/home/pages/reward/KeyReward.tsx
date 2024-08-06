import { KeyRewardType } from "@/home/store/rewardStore";
import { useGSAP } from "@gsap/react";
import { getYCenterBoudingOfElement } from "@repo/lib";
import gsap from "gsap";
import { useRef } from "react";

interface KeyRewardProps {
  reward: KeyRewardType;
  removeCurrentReward: () => void;
}

function getPositionAbsolute(element: HTMLElement, windowY: number) {
  const centerOfElement = getYCenterBoudingOfElement(element);
  return windowY - centerOfElement;
}

export default function KeyReward({
  reward,
  removeCurrentReward,
}: KeyRewardProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, ctxSafe) => {
      if (!scope.current || !ctxSafe) return;
      const tl = gsap.timeline();
      tl.fromTo(
        scope.current.querySelector("img"),
        { scale: 0 },
        { scale: 1, duration: 1.5, ease: "elastic" },
        "start"
      );
      const imageElement = scope.current!.querySelector("img");
      const onClick = ctxSafe(() => {
        if (imageElement === null) return;
        tl.to(imageElement, {
          rotate: 720,
          duration: 1,
          ease: "power2.in",
          delay: -1,
        });
        tl.to(imageElement, {
          y: -100,
          duration: 0.4,
          ease: "power2.out",
        });
        tl.to(imageElement, {
          y: getPositionAbsolute(imageElement, window.innerHeight) - 80,
          duration: 0.6,
          ease: "power2.in",
        });
        tl.to(imageElement, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: removeCurrentReward
        });
      });
      scope.current.addEventListener("click", onClick);
      return () => {
        scope.current?.removeEventListener("click", onClick);
      }
    },
    { scope, dependencies: [reward] }
  );

  return (
    <div
      className="h-full flex flex-col justify-center items-center relative"
      ref={scope}
    >
      <img
        src={"/key.png"}
        alt="money"
        className="w-[300px] h-[300px]"
      />
    </div>
  );
}
