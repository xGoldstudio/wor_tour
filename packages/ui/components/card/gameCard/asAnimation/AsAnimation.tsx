import { animationTimeline, getImageUrlCssValue, TEXTURE } from "@repo/lib";
import {
  useSyncGameAnimation,
  useSyncTimelineAnimation,
} from "../../useGameSyncAnimation";
import useGameEventListener from "../../useGameEventListener";
import { BeforeCardDestroyedEvent, ChangeAttackSpeedEvent } from "game_engine";
import { useRef } from "react";
import { asAnimationMachine } from "./asAnimationMachine";
import { useMachine } from "@xstate/react";

interface AsAnimationProps {
  trackedInstanceId: React.MutableRefObject<number | null>;
}

export default function AsAnimation({ trackedInstanceId }: AsAnimationProps) {
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
          const element = ref.current?.querySelector<HTMLElement>(".fire");
          if (!element) {
            return;
          }
          element.style.display = "block";
        },
        onInvisible: () => {
          removeAsAnimation();
          const element = ref.current?.querySelector<HTMLElement>(".fire");
          if (!element) {
            return;
          }
          element.style.display = "none";
        },
      },
    })
  );

  useGameEventListener<ChangeAttackSpeedEvent>({
    type: "changeAttackSpeed",
    action: (event, state) => {
      const card = state.getCardInstance(event.instanceId);
      if (!card) return;
      if (card.attackSpeed > card.initialAttackSpeed) {
        send({ type: "asPositiv" });
      } else {
        send({ type: "asNegativOrNormal" });
      }
    },
    filter: (e) => e.instanceId === trackedInstanceId.current,
  });

  useGameEventListener<BeforeCardDestroyedEvent>({
    type: "beforeCardDestroyed",
    action: () => {
      send({ type: "death" });
    },
    filter: (e) => e.initiator.instanceId === trackedInstanceId.current,
  });

	const AS_ANIMATION_KEY = "asAnimation";

  function stopAsHigherAnimation() {
    const element = ref.current?.querySelector<HTMLElement>(".fire");
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
				{ key: AS_ANIMATION_KEY },
      ),
      onComplete: () => {
        send({ type: "animationEnd" });
      },
    });
  }

  function startAsHigherAnimation() {
    const element = ref.current?.querySelector<HTMLElement>(".fire");
    if (!element) {
      return;
    }
    const duration = 1000;
    triggerAsAnimation({
      duration: duration,
      loop: true,
      computeStyle: animationTimeline(duration).add(
        element,
        { rotate: 0, opacity: 100 },
        [{ values: { rotate: 360 } }]
      ).progress,
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
				{ key: AS_ANIMATION_KEY },
      ),
      onComplete: () => {
        send({ type: "animationEnd" });
      },
    });
  }

  return (
    <div
      className="w-[106%] h-[106%] absolute -top-[3%] -left-[3%] origin-top overflow-hidden rounded-md"
      ref={ref}
    >
      <div className="w-[200%] h-[200%] top-1/2 left-1/2 opacity-100 absolute transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-full h-full fire hidden opacity-0 absolute"
          style={{
            backgroundImage: getImageUrlCssValue(TEXTURE, "fire.avif"),
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </div>
    </div>
  );
}
