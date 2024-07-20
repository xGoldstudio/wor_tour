import { useRef, useState } from "react";
import { useRegisterAnimation } from "./gameBehavior/animation/useGameSyncAnimation";
import animationTimeline from "./gameBehavior/animation/timeline";
import useGameEventListener from "./gameBehavior/useGameEventListener";
import { cn } from "@repo/ui";

export default function StartSequence() {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const { registerAnimation } = useRegisterAnimation();
  useGameEventListener({
    type: "startGameSequence",
    action: () => {
      if (!wrapperRef.current) {
        return;
      }
      const element = wrapperRef.current?.querySelector(
        ".startText"
      ) as HTMLElement;
      registerAnimation({
        duration: 240,
        computeStyle: animationTimeline(240).add(element, { scaleX: 1 }, [
          { values: { scaleX: 1.05 }, from: 20, ease: [0, 1, 1, 1] },
          { values: { scaleX: 0.85 }, from: 40, ease: [0, 1, 1, 1] },
          { values: { scaleX: 1 }, from: 50, ease: [0, 0.42, 1, 1] },

          {
            values: { scaleX: 1.05 },
            from: 80,
            ease: [0, 1, 1, 1],
            onStart: () => (element.innerHTML = "2"),
          },
          { values: { scaleX: 0.85 }, from: 90, ease: [0, 1, 1, 1] },
          { values: { scaleX: 1 }, from: 110, ease: [0, 0.42, 1, 1] },

          {
            values: { scaleX: 1.05 },
            from: 140,
            ease: [0, 1, 1, 1],
            onStart: () => (element.innerHTML = "1"),
          },
          { values: { scaleX: 0.85 }, from: 150, ease: [0, 1, 1, 1] },
          { values: { scaleX: 1 }, from: 170, ease: [0, 0.42, 1, 1] },

          {
            values: { scaleX: 1.05 },
            from: 200,
            ease: [0, 1, 1, 1],
            onStart: () => (element.innerHTML = "Start!"),
          },
          { values: { scaleX: 0.85 }, from: 210, ease: [0, 1, 1, 1] },
          { values: { scaleX: 1 }, from: 230, ease: [0, 0.42, 1, 1] },
        ]).progress,
      });
      registerAnimation({
        duration: 240,
        computeStyle: animationTimeline(240).add(
          wrapperRef.current,
          { opacity: 100 },
          { values: { opacity: 0 }, from: 230, ease: [0, 0.42, 1, 1] }
        ).progress,
      });
    },
  });

  useGameEventListener({
    type: "startGame",
    action: () => {
      if (!wrapperRef.current) {
        return;
      }
      wrapperRef.current.style.display = "hidden";
      setIsStarted(true);
    },
  });

  return (
    <div
      className={cn(
        "left-0 top-0 absolute w-full h-full pointer-events-none z-20 flex justify-center items-center",
        isStarted && "hidden"
      )}
      ref={wrapperRef}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
      <p className="startText text-[150px] text-white relative drop-shadow-[2px_2px_2px_black]">
        3
      </p>
    </div>
  );
}
