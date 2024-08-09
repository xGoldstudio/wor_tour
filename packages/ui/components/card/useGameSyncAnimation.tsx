import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { useOnMount, useOnUnMount } from "@repo/ui";
import { GameStateObject } from "game_engine";
import { AnimationTimeline } from "@repo/lib";
import { uniqueId } from "lodash";

type ComputeAnimation = (
  state: GameStateObject,
  frame: number,
  ref: HTMLElement
) => number;

type Animation = {
  progress: (frame: number, state: GameStateObject) => void;
};

interface GameSyncAnimationStore {
  animations: Map<string, Animation>;
}

const useAnimationStore = create<GameSyncAnimationStore>(() => ({
  animations: new Map(),
}));

function useGameSyncAnimationStore() {
  const store = useAnimationStore();

  function triggerGameSyncAnimation(state: GameStateObject, frame: number) {
    window.requestAnimationFrame(() => {
      store.animations.forEach((animation) => {
        animation.progress(frame, state);
      });
    });
  }

  function reset() {
    store.animations.clear();
  }

  useOnMount(reset);

  return {
    triggerGameSyncAnimation,
    reset: () => {
      reset();
    },
  };
}

// same as useGameSyncAnimationStore but can run multiple animations at the same time
export function useRegisterAnimation() {
  const store = useAnimationStore();
  const removeListeners = useRef<Map<string, () => void>>(new Map());

  function registerAnimation({
    duration,
    computeStyle,
    onEnd,
  }: {
    duration: number;
    computeStyle: (progress: number) => void;
    onEnd?: () => void;
  }) {
    const key = uniqueId();
    let firstFrame: null | number = null;
    removeListeners.current.set(key, () => {
      store.animations.delete(key);
      removeListeners.current.delete(key);
      onEnd?.();
    });
    store.animations.set(key, {
      progress: (frame) => {
        if (firstFrame === null) {
          firstFrame = frame;
        }
        computeStyle(frame - firstFrame);
        if (frame - firstFrame > duration) {
          removeListeners.current.get(key)?.();
        }
      },
    });
  }

  useOnUnMount(() => {
    // remove all existing liteners
    removeListeners.current.forEach((remove) => remove());
  });

  return {
    registerAnimation,
  };
}

interface TriggerAnimationProps {
  duration: number;
  computeStyle: (progress: number) => void;
  replace?: boolean;
  queueAnimation?: boolean;
  onEnd?: () => void;
  onComplete?: () => void; // same as on end, but require the animation to fully run to call it
}

export function useSyncGameAnimation() {
  const store = useAnimationStore();
  const removeListener = useRef<null | (() => void)>(null);
  const queue = useRef<TriggerAnimationProps[]>([]);

  function triggerAnimation({
    duration,
    computeStyle,
    replace,
    queueAnimation,
    onEnd,
    onComplete,
  }: TriggerAnimationProps) {
    if (removeListener.current) {
      if (replace) {
        removeListener.current?.();
        queue.current = [];
      } else if (queueAnimation) {
        queue.current.push({
          duration,
          computeStyle,
          onEnd,
          onComplete,
        });
        return;
      } else {
        return;
      }
    }
    const key = uniqueId();
    let firstFrame: null | number = null;
    let offset = 0;
    removeListener.current = () => {
      store.animations.delete(key);
      removeListener.current = null;
      onEnd?.();
    };
    store.animations.set(key, {
      progress: (frame) => {
        if (firstFrame === null) {
          firstFrame = frame;
        }
        const referenceFrame = firstFrame - offset;
        computeStyle(frame - referenceFrame);
        if (frame - referenceFrame > duration) {
          onComplete?.();
          removeListener.current?.();
          consumeQueue();
        }
      },
    });
    return {
      fastForward: (value: number) => {
        offset = Math.max(value, 0);
      }
    }
  }

  function consumeQueue() {
    if (queue.current.length > 0) {
      const next = queue.current.shift();
      if (next) {
        triggerAnimation(next);
      }
    }
  }

  useOnUnMount(() => {
    removeListener.current?.();
  });

  function removeAnimation() {
    removeListener.current?.();
  }

  return {
    triggerAnimation,
    removeAnimation,
  };
}

function useGameAnimation({
  getProgress,
  tl,
  deps,
}: {
  getProgress: ComputeAnimation;
  tl: (element: HTMLElement, state: GameStateObject) => AnimationTimeline;
  deps?: React.DependencyList;
}) {
  const [animationRef, setAnimationRef] = useState<null | HTMLElement>(null);
  const store = useAnimationStore();
  const isSet = useRef<null | string>(null);

  useOnUnMount(() => {
    removeAnimation();
  });

  useEffect(() => {
    if (animationRef === null) {
      removeAnimation();
      return;
    }
    registerAnimation(animationRef);
  }, [animationRef]);

  useEffect(() => {
    if (!deps || !isSet || !animationRef) {
      return;
    }
    registerAnimation(animationRef);
  }, deps ?? []);

  function removeAnimation() {
    const key = isSet.current;
    if (!key) {
      return;
    }
    isSet.current = null;
    return store.animations.delete(key);
  }

  function registerAnimation(element: HTMLElement) {
    removeAnimation();
    const key = uniqueId();
    store.animations.set(key, {
      progress: (frame, state) =>
        tl(element, state).progress(getProgress(state, frame, element)),
    });
    isSet.current = key;
  }

  return setAnimationRef;
}

export { useGameSyncAnimationStore, useGameAnimation };
