import { animationTimeline, getCenterOfBoundingElement, getImageUrlCssValue, ICONS } from "@repo/lib";
import {
  useGameEventListener,
  useRegisterAnimation,
  useSyncGameAnimation,
} from "@repo/ui";
import { GameOverEvent } from "game_engine";
import { useRef } from "react";

export const HEART_DEATH_ANIMATION_DURATION = 80;

export default function PlayerHeart({ isPlayer }: { isPlayer: boolean }) {
  const scope = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();
  const { registerAnimation } = useRegisterAnimation();

  useGameEventListener({
    type: "gameOver",
    action: () => {
      if (!scope.current) {
        return;
      }
      const centerOfScreenX = window.innerWidth / 2;
      const centerOfScreenY = window.innerHeight / 3;
      const centerOfElement = getCenterOfBoundingElement(scope.current);
      triggerAnimation({
        duration: HEART_DEATH_ANIMATION_DURATION,
        onComplete: triggerHeartOpeningAnimation,
        computeStyle: animationTimeline(HEART_DEATH_ANIMATION_DURATION).add(
          scope.current,
          { scale: 1, x: 0, y: 0 },
          [
            {
              values: {
                scale: 10,
                x: centerOfScreenX - centerOfElement.x,
                y: centerOfScreenY - centerOfElement.y,
              },
              ease: [0, 1, 1, 1],
            },
          ]
        ).progress,
      });
    },
    filter: (event) => (event as GameOverEvent).winner === (isPlayer ? "opponent" : "player") || (event as GameOverEvent).winner === "draw",
  });

  function triggerHeartOpeningAnimation() {
    if (!scope.current) {
      return;
    }
    const leftHeart = scope.current.querySelector<HTMLDivElement>(".leftHeart");
    const rightHeart =
      scope.current.querySelector<HTMLDivElement>(".rightHeart");
    const fullHeart = scope.current.querySelector<HTMLDivElement>(".fullHeart");
    if (!leftHeart || !rightHeart || !fullHeart) {
      return;
    }
    fullHeart.style.opacity = "0";
    registerHeartAnimation(leftHeart, "left");
		registerHeartAnimation(rightHeart, "right");
  }

	function registerHeartAnimation(element: HTMLDivElement, direction: "left" | "right") {
		registerAnimation({
      duration: 100,
      computeStyle: animationTimeline(100).add(element, { rotate: 0 }, [
        {
          values: {
            rotate: direction === "left" ? -90 : 90,
          },
          ease: [0, 1, 1, 1],
        },
      ]).progress,
    });
    registerAnimation({
      duration: 130,
      computeStyle: animationTimeline(130).add(element, { opacity: 100 }, [
        {
          values: {
            opacity: 0,
          },
          ease: [0, 1, 1, 1],
        },
      ]).progress,
    });
	}

  return (
    <div
      className="absolute z-20 left-[-25px] top-[-10px] w-[50px] h-[50px]"
      ref={scope}
    >
      <div
        className="w-1/2 h-full absolute opacity-0 leftHeart origin-[100%_85%]"
        style={{
          backgroundImage: getImageUrlCssValue(ICONS ,"heart.png"),
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div
        className="w-[50%] left-1/2 h-full absolute top-0 opacity-0 rightHeart origin-[0%_85%]"
        style={{
          backgroundImage: getImageUrlCssValue(ICONS ,"heart.png"),
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
        }}
      ></div>
      <div
        className="w-full h-full absolute fullHeart"
        style={{
          backgroundImage: getImageUrlCssValue(ICONS ,"heart.png"),
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
        }}
      ></div>
    </div>
  );
}
