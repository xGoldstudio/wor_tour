import React from "react";
import {
  useGameEventListener,
  useSyncGameAnimation,
  useSyncTimelineAnimation,
} from "@repo/ui";
import { useMachine } from "@xstate/react";
import { useRef } from "react";
import { asAnimationMachine } from "./asAnimationMachine";
import { BeforeCardDestroyedEvent } from "game_engine";
import { animationTimeline } from "@repo/lib";

interface UseGameCardRingAnimationProps {
  trackedInstanceId: React.MutableRefObject<number | null>;
  rotationSpeed: number;
}

export default function useGameCardRingAnimation({
  rotationSpeed,
  trackedInstanceId,
}: UseGameCardRingAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    triggerAnimation: triggerAsAnimation,
    removeAnimation: removeAsAnimation,
  } = useSyncGameAnimation();
  const {
    triggerAnimation: triggerAsOpacityAnimation,
    timelineRef: asTimelineRef,
  } = useSyncTimelineAnimation();
  const [, send] = useMachine(
    asAnimationMachine.provide({
      actions: {
        onAppear: () => {
          startAsHigherAnimation();
        },
        onDisappear: () => {
          stopAsHigherAnimation();
        },
        onVisible: () => {
          const element = ref.current?.querySelector<HTMLElement>(".ring");
          if (!element) {
            return;
          }
          element.style.display = "block";
        },
        onInvisible: () => {
          removeAsAnimation();
          const element = ref.current?.querySelector<HTMLElement>(".ring");
          if (!element) {
            return;
          }
          element.style.display = "none";
        },
      },
    })
  );

  useGameEventListener<BeforeCardDestroyedEvent>({
    type: "beforeCardDestroyed",
    action: () => send({ type: "death" }),
    filter: (e) => e.instanceId === trackedInstanceId.current,
  });

  const AS_ANIMATION_KEY = "asAnimation";

  function stopAsHigherAnimation() {
    const element = ref.current?.querySelector<HTMLElement>(".ring");
    if (!element) {
      return;
    }
    triggerAsOpacityAnimation({
      replace: true,
      duration: 50,
      timeline: animationTimeline(50).add(
        element,
        asTimelineRef.current?.getCache(AS_ANIMATION_KEY)?.lastValue ?? {
          opacity: 100,
        },
        [{ values: { opacity: 0 }, ease: [0, 1, 1, 1] }],
        { key: AS_ANIMATION_KEY }
      ),
      onComplete: () => {
        send({ type: "animationEnd" });
      },
    });
  }

  function startAsHigherAnimation() {
    const element = ref.current?.querySelector<HTMLElement>(".ring");
    if (!element) {
      return;
    }
    const duration = 1000 / rotationSpeed;
    triggerAsAnimation({
      duration: duration,
      loop: true,
      computeStyle: animationTimeline(duration).add(element, { rotate: 0 }, [
        { values: { rotate: 360 } },
      ]).progress,
    });
    triggerAsOpacityAnimation({
      replace: true,
      duration: 50,
      timeline: animationTimeline(50).add(
        element,
        asTimelineRef.current?.getCache(AS_ANIMATION_KEY)?.lastValue ?? {
          opacity: 0,
        },
        [{ values: { opacity: 100 } }],
        { key: AS_ANIMATION_KEY }
      ),
      onComplete: () => {
        send({ type: "animationEnd" });
      },
    });
  }

  const activate = () => send({ type: "asPositiv" });
  const deactivate = () => send({ type: "asNegativOrNormal" });

  return {
    ref,
    activate,
    deactivate,
  };
}
