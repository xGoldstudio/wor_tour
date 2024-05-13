import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import * as CSS from "csstype";

type ComputeAnimation<State> = (state: State) => CSS.Properties;

type Animation<State> = {
  compute: ComputeAnimation<State>;
  element: HTMLElement;
};

interface GameSyncAnimationStore<State> {
  animations: Map<string, Animation<State>>;
}

let store: GameSyncAnimationStore<unknown> = {
  animations: new Map(),
};

function initStore() {
  store = {
    animations: new Map(),
  };
}

function useGameSyncAnimationStore<State>() {
  function triggerGameSyncAnimation(state: State) {
    store.animations.forEach((animation) => {
			const styleToChange = animation.compute(state);
      for (const key in styleToChange) {
				// @ts-expect-error key is bugged
				animation.element.style[key] = styleToChange[key];
      }
    });
  }

  useEffect(() => {
    initStore();
    return initStore;
  }, []);

  return triggerGameSyncAnimation;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useGameAnimation<State, Element = any>(
  computeAnimation: ComputeAnimation<State>
) {
  const animationRef = useRef<null | Element>(null);

  useEffect(() => {
    if (animationRef.current === null) {
      return () => {};
    }
    const key = registerAnimation(animationRef.current);
    return () => removeAnimation(key);
  }, [animationRef.current]);

  function registerAnimation(element: Element) {
    const key = uuidv4();
    store.animations.set(key, {
      element: element as HTMLElement,
      compute: computeAnimation as ComputeAnimation<unknown>,
    });
    return key;
  }

  function removeAnimation(key: string) {
    return store.animations.delete(key);
  }

  return animationRef;
}

export { useGameSyncAnimationStore, useGameAnimation };

