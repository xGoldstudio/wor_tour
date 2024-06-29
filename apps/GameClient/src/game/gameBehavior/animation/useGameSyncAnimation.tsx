import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { useOnMount, useOnUnMount } from "@repo/ui";
import { AnimationTimeline } from "./timeline";

type ComputeAnimation<State> = (state: State, frame: number, ref: HTMLElement) => number;

type Animation<State> = {
  tl: AnimationTimeline;
  getProgress: ComputeAnimation<State>;
  element: HTMLElement;
  prevProgress: number;
};

interface GameSyncAnimationStore<State> {
  animations: Map<string, Animation<State>>;
}

const useAnimationStore = create<GameSyncAnimationStore<unknown>>(() => ({
  animations: new Map(),
}));

function useGameSyncAnimationStore<State>() {
  const store = useAnimationStore();

  function triggerGameSyncAnimation(state: State, frame: number) {
    store.animations.forEach((animation) => {
      animation.tl.progress(animation.getProgress(state, frame, animation.element));
      // for (const key in styleToChange) {
      //   // @ts-expect-error key is bugged
      //   animation.element.style[key] = styleToChange[key];
      // }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useGameAnimation<State>({
  getProgress,
  tl,
  deps,
}: {
  getProgress: ComputeAnimation<State>;
  tl: (element: HTMLElement) => AnimationTimeline;
  deps?: React.DependencyList;
}) {
  const [animationRef, setAnimationRef] = useState<null | HTMLElement>(null);
  const store = useAnimationStore();
  const [isSet, setIsSet] = useState<false | string>(false);

  useOnUnMount(() => {
    removeAnimation();
  });

  useEffect(() => {
    if (animationRef === null) {
      removeAnimation();
      return;
    }
    if (isSet && animationRef === store.animations.get(isSet)?.element) {
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
    const key = isSet;
    if (!key) {
      return;
    }
    setIsSet(false);
    return store.animations.delete(key);
  }
  function registerAnimation(element: HTMLElement) {
    removeAnimation();
    const key = uuidv4();
    store.animations.set(key, {
      element: element,
      getProgress: getProgress as ComputeAnimation<unknown>,
      tl: tl(element),
      prevProgress: -1,
    });
    setIsSet(key);
  }

  return setAnimationRef;
}

export { useGameSyncAnimationStore, useGameAnimation };
