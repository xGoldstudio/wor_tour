import { useContext, useLayoutEffect, useState } from "react";
import { TrophyBarContext, TrophyBarContextType } from "./TrophyBarContext";
import { inPx, textureByRarity } from "@repo/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import useCustomAnimation, {
  useTriggerCustomAnimation,
} from "./useCustomAnimation";
import { cubicBezier } from "framer-motion";

export default function TrophyBar({
  scrollRef,
  targetYPosition,
  maxTargetYPosition,
  distanceFromTrophies,
  numberOfTrophies,
}: {
  targetYPosition: number;
  maxTargetYPosition: number;
  scrollRef: HTMLDivElement;
  distanceFromTrophies: number;
  numberOfTrophies: number;
}) {
  const [barRef, setBarRef] = useState<HTMLDivElement | null>(null);
  const [innerBarRef, setInnerBarRef] = useState<HTMLDivElement | null>(null);
  const [innerMaxBarRef, setInnerMaxBarRef] = useState<HTMLDivElement | null>(
    null
  );
  const { trophiesFields } = useContext(
    TrophyBarContext
  ) as TrophyBarContextType;

  const startTrophies = trophiesFields[0].yPosition;

  const height = startTrophies - targetYPosition + 7;
  const maxHeight = startTrophies - maxTargetYPosition + 7;

  const targetY = targetYPosition - 150;
  const currentY = startTrophies;
  const { isOver } = useCustomAnimation({
    compute: (progress: number) => {
      const diff = targetY - currentY;
      const newY = currentY + diff * progress;
      scrollRef.scrollTo({ top: newY });
      if (innerBarRef) {
        innerBarRef.style.transform = `scaleY(${progress * 100}%) translateX(-50%)`;
      }
    },
    duration: 1400,
    ease: cubicBezier(0.5, 0.15, 0.34, 0.5),
    waitFor: !!innerBarRef,
    onStart: () =>
      document
        .getElementById("scrollBlocker")
        ?.setAttribute("style", "display: block"),
    onEnd: () =>
      document
        .getElementById("scrollBlocker")
        ?.setAttribute("style", "display: hidden"),
  });

  useCustomAnimation({
    compute: (progress: number) => {
      if (innerMaxBarRef) {
        innerMaxBarRef.style.opacity = `${progress * 30}%`;
      }
    },
    duration: 1400,
    ease: cubicBezier(0.5, 0.15, 0.34, 0.5),
    waitFor: !!innerMaxBarRef,
    delay: 500,
  });

  useLayoutEffect(() => {
    scrollRef.scrollTo({ top: currentY });
  }, []);

  const trigger = useTriggerCustomAnimation();

  function scrollToCurrentTrophies() {
    const currentScrollPosition = scrollRef.scrollTop;
    trigger({
      compute: (progress: number) => {
        const diff = targetY - currentScrollPosition;
        const newY = currentScrollPosition + diff * progress;
        scrollRef.scrollTo({ top: newY });
      },
      duration: 600,
      ease: cubicBezier(0.25, 0.6, 0.25, 0.6),
      onStart: () =>
        document
          .getElementById("scrollBlocker")
          ?.setAttribute("style", "display: block"),
      onEnd: () =>
        document
          .getElementById("scrollBlocker")
          ?.setAttribute("style", "display: hidden"),
    });
  }

  return (
    <div
      className="absolute w-[32px] h-full left-0 z-10"
      ref={(ref) => setBarRef(ref)}
    >
      <div className="absolute w-full h-full bg-gradient-to-r  from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] opacity-60" />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[60%] rounded-sm bg-gradient-to-r from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] brightness-200 opacity-30"
        style={{
          height: inPx(maxHeight),
          transformOrigin: "bottom",
          bottom: `calc(100% - ${startTrophies + 7}px`,
        }}
        ref={(ref) => setInnerMaxBarRef(ref)}
      ></div>
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[60%] rounded-sm bg-gradient-to-r from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] brightness-125"
        style={{
          height: inPx(height),
          transformOrigin: "bottom",
          bottom: `calc(100% - ${startTrophies + 7}px`,
        }}
        ref={(ref) => setInnerBarRef(ref)}
      ></div>
      <div
        className="absolute left-4 translate-y-1/2 z-20"
        style={{
          bottom: `calc(100% - ${startTrophies - height + 7}px`,
        }}
      >
        <svg
          width="120"
          height="50"
          viewBox="0 0 120 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="svgmask">
            <rect
              x="7"
              y="0"
              width={113}
              height={50}
              fill="white"
              rx="4"
              ry="4"
            ></rect>
            <polygon points="0,25 7,35 7,15" fill="white" />
          </mask>
          <rect
            x="0"
            y="0"
            width={120}
            height={50}
            fill="#ffffff"
            mask="url(#svgmask)"
          ></rect>
          <image
            className="blur-[6px]"
            href={textureByRarity("legendary")}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#svgmask)"
          />
        </svg>
        <div className="w-full h-full absolute top-1/2 -translate-x-3 -translate-y-1/2 flex justify-center items-center">
          <img
            src="/trophy.png"
            className="w-[28px] drop-shadow-[2px_1px_1px_black]"
          />
          <p className="text-slate-100 drop-shadow-[1px_1px_1px_black]">
            {numberOfTrophies}
          </p>
        </div>
      </div>
      {trophiesFields.map((field) => (
        <div
          className="absolute left-0 z-10 w-full"
          style={{ top: inPx(field.yPosition) }}
          key={field.trophies}
        >
          <div className="w-full h-[2px] bg-gradient-to-b from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] opacity-60" />
          <div className="absolute top-0 -translate-y-1/2 -right-2 translate-x-full text-slate-100 text-sm drop-shadow-[1px_1px_1px_black]">
            {field.trophies}
          </div>
        </div>
      ))}
      {isOver &&
        barRef &&
        (distanceFromTrophies > 0 || distanceFromTrophies < 0) && (
          <div
            className="fixed top-[64px] z-10"
            style={{
              left: inPx((barRef.getBoundingClientRect().x ?? 0) + 40),
            }}
          >
            <button
              className="rounded-sm bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] p-0.5"
              onClick={scrollToCurrentTrophies}
            >
              {distanceFromTrophies > 0 ? (
                <ChevronUp color="white" />
              ) : (
                <ChevronDown color="white" />
              )}
            </button>
          </div>
        )}
    </div>
  );
}
