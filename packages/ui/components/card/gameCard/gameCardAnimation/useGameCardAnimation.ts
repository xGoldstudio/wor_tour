import { AfterPlaceCardEvent, CardDestroyedEvent, CardEndAttackingAnimationEvent, CardStartAttackingAnimationEvent, CardStartAttackingEvent, GameOverEvent } from "game_engine";
import { useSyncGameAnimation, useSyncTimelineAnimation } from "../../useGameSyncAnimation";
import useGameEventListener from "../../useGameEventListener";
import { animationTimeline } from "@repo/lib";
import { useOnMount } from "@repo/ui";
import { ActorRefFrom, createActor } from "xstate";
import { cardAnimationMachine } from "./cardAnimationMachine";
import { useRef } from "react";

interface UseGameCardAnimationProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  isPlayerCard: boolean;
  cardPosition: number;
  trackedInstanceId: React.MutableRefObject<number | null>;
}

export default function useGameCardAnimation({ cardRef, isPlayerCard, trackedInstanceId, cardPosition }: UseGameCardAnimationProps) {
  const { triggerAnimation: triggerAttackAnimation, timelineRef } = useSyncTimelineAnimation();
  const { triggerAnimation: triggerAttackAnimation2 } = useSyncGameAnimation();
  const machineRef = useRef<ActorRefFrom<typeof cardAnimationMachine> | null>(null);

  useOnMount(() => {
    machineRef.current = createActor(
      cardAnimationMachine.provide({
        actions: {
          onAppear: onPlacement,
          onDisappear: onDeath,
          onAttack: (a) => {
            onAttack(a.event.animationDuration, a.event.progressFrame);
          },
          onBackToPosition,
          onInvisible: () => {
            const element = cardRef.current;
            if (!element) {
              return;
            }
            element.style.display = "none";
          },
          onVisible: () => {
            const element = cardRef.current;
            if (!element) {
              return;
            }
            element.style.display = "block";
          },
        },
      })
    ).start();
  });

  function onAttack(animationDuration: number, progressFrame: number) {
    const init = timelineRef.current?.getLastCache();
    triggerAttackAnimation({
      replace: true,
      duration: animationDuration,
      timeline: animationTimeline(animationDuration)
        .add(cardRef.current, { scale: 1, y: 0, ...init }, [
          {
            to: (2/3) * animationDuration,
            ease: [0, 1, 1, 1],
            values: { scale: 1.08, y: isPlayerCard ? 15 : -15, opacity: 100 },
          },
          {
            ease: [0, 0.42, 1, 1],
            values: { scale: 1.08, y: isPlayerCard ? -15 : 15, opacity: 100 },
          },
        ], { key: "attack" }),
    })?.fastForward(progressFrame);
  }

  function onBackToPosition() {
    const currentState = timelineRef.current?.getLastCache();
    triggerAttackAnimation({
      replace: true,
      duration: 20,
      // not important animation, thus not tracked in game state, can be desynchronized without further issue
      onComplete: () => machineRef.current?.send({ type: "animationEnd" }),
      timeline: animationTimeline(20).add(
        cardRef.current,
        { ...currentState },
        {
          ease: [0, 0.42, 1, 1],
          values: { scale: 1, y: 0, opacity: 100 },
        },
        { key: "backToPosition" }
      )
    });
  }

  function onPlacement() {
    triggerAttackAnimation({
      replace: true,
      duration: 50,
      timeline: animationTimeline(50)
        .add(cardRef.current, { opacity: 0, scale: 0.5 }, [
          { values: { opacity: 100, scale: 1 }, ease: [0, 1, 1, 1] },
        ]),
    })
  }

  function onDeath() {
    if (cardRef.current === null) {
      return;
    }
    const position = timelineRef.current?.getLastCache();
    triggerAttackAnimation({
      replace: true,
      duration: 50,
      timeline: animationTimeline(50)
        .add(
          cardRef.current,
          { opacity: 100, x: 0, ...position },
          [
            { values: { ...position, opacity: 75, x: 10 }, to: 12 },
            { values: { opacity: 50, x: -10, y: 0, scale: 1 }, to: 24 },
            { values: { opacity: 25, x: 10, y: 0, scale: 1 }, to: 36 },
            { values: { opacity: 0, x: 0, y: 0, scale: 1 } },
          ]
        ),
    });
  }

  useGameEventListener<CardStartAttackingEvent>({
    type: "cardStartAttacking",
    action: (_, state, __, clock) => {
      if (trackedInstanceId.current === null) {
        return;
      }
      const card = state.getCardByInstance(trackedInstanceId.current);
      if (card && cardRef.current) {
        const animationDuration = card.endAttackingTick! - card.startAttackingTick! - 1;
        const remainingFrames = card.endAttackingTick! - clock.getImmutableInternalState().currentFrame;
        triggerAttackAnimation2({
          replace: true,
          duration: animationDuration,
          computeStyle: animationTimeline(animationDuration)
            .add(
              cardRef.current.querySelector<HTMLElement>(".animationProgress"),
              { scaleY: 1 },
              { values: { scaleY: 0 } }
            )
            .progress,
        })?.fastForward(animationDuration - remainingFrames);
      }
    },
    filter: (event) => event.instanceId === trackedInstanceId.current,
  });
  useGameEventListener<CardStartAttackingAnimationEvent>({
    type: "cardStartAttackingAnimation",
    action: (event) => machineRef.current?.send({ type: "startAttack", animationDuration: event.animationDuration, progressFrame: event.progressFrame }),
    filter: (event) => event.instanceId === trackedInstanceId.current,
  });
  useGameEventListener<CardEndAttackingAnimationEvent>({
    type: "cardEndAttackingAnimation",
    action: () => machineRef.current?.send({ type: "animationEnd" }),
    filter: (event) => event.instanceId === trackedInstanceId.current,
  });
  useGameEventListener<AfterPlaceCardEvent>({
    type: "afterPlaceCard",
    action: () => {
      machineRef.current?.send({ type: "placed" });
    },
    filter: (event) =>
      event.position === cardPosition && event.isPlayer === isPlayerCard,
  });
  function sendDeath() {
    machineRef.current?.send({ type: "death" });
  }
  useGameEventListener<CardDestroyedEvent>({
    type: "cardDestroyed",
    action: () => {
      sendDeath();
    },
    filter: (event) => event.instanceId === trackedInstanceId.current,
  });
  useGameEventListener<GameOverEvent>({
    type: "gameOver",
    action: (event, state) =>
      event.winner === (isPlayerCard ? "opponent" : "player") &&
      trackedInstanceId.current !== null &&
      state.getCardByInstance(trackedInstanceId.current) &&
      sendDeath(),
  });
}