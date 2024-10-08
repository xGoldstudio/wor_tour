import { cubicBezier } from "@repo/lib";

type AnimatedProperties = "x" | "y" | "scale" | "opacity" | "scaleX" | "scaleY" | "rotate";

type AnimationValues = Partial<Record<AnimatedProperties, number>>;

type Ease = [number, number, number, number];

interface Sequence {
  from?: number
  to?: number;
  values: AnimationValues;
  ease?: Ease;
  onStart?: () => void;
}

export interface AnimationTimelineAddOptions {
  key?: string;
}

export interface AnimationTimeline {
  add: (
    element: HTMLElement | string | null,
    initialValues: AnimationValues,
    sequences: Sequence[] | Sequence,
    options?: AnimationTimelineAddOptions,
  ) => AnimationTimeline;
  progress: (elapsedFrames: number) => AnimationTimeline;
  animations: RegisteredTimelineAnimation[];
  getCache: (title: string) => RegisteredTimelineAnimationCache | undefined;
  getLastCache: () => AnimationValues;
}

export interface RegisteredTimelineAnimationCache {  // may be used for future optimization
  lastValue: AnimationValues;
  progress: number;
}

export interface RegisteredTimelineAnimation {
  element: HTMLElement;
  key?: string;
  initialValues: AnimationValues;
  sequences: Sequence[] | Sequence;
  cache: RegisteredTimelineAnimationCache;
}

interface LastCacheValue {
  value: AnimationValues;
}

export default function animationTimeline(requiredFrames: number): AnimationTimeline {
  const allAnimations: RegisteredTimelineAnimation[] = [];
  const lastCache: LastCacheValue = { value: {} };

  function add(element: HTMLElement | string | null,
    initialValues: AnimationValues,
    sequences: Sequence[] | Sequence,
    options?: AnimationTimelineAddOptions,
  ) {
    if (element === null) {
      console.warn("Element is null");
      return state;
    }
    const elt = typeof element === "string" ? document.querySelector<HTMLElement>(element) : element;
    if (!elt) {
      console.warn("Element not found", element);
      return state;
    }
    const allSequences = Array.isArray(sequences) ? sequences : [sequences];
    allAnimations.push({
      element: elt,
      initialValues,
      sequences: allSequences.map((_, i) => buildSequence(i, allSequences)),
      cache: {
        lastValue: { ...initialValues },
        progress: 0,
      },
      key: options?.key,
    });
    lastCache.value = { ...lastCache.value, ...initialValues };
    return state;
  }

  function buildSequence(index: number, sequences: Sequence[]): Sequence {
    const sequence = sequences[index];
    const seqRes = { ...sequence };
    if (sequence.from === undefined) {
      if (index === 0) {
        seqRes.from = 0;
      } else {
        const prevSeqTo = sequences[index - 1].to;
        seqRes.from = prevSeqTo !== undefined ? (prevSeqTo < 0 ? requiredFrames + prevSeqTo : prevSeqTo) : 0;
      }
    } else if (sequence.from < 0) {
      seqRes.from = requiredFrames + sequence.from;
    }
    if (sequence.to === undefined) {
      if (index === sequences.length - 1) {
        seqRes.to = requiredFrames;
      } else {
        const nextSeqFrom = sequences[index + 1].from;
        seqRes.to = nextSeqFrom !== undefined ? (nextSeqFrom < 0 ? requiredFrames + nextSeqFrom : nextSeqFrom) : requiredFrames;
      }
    } else if (sequence.to < 0) {
      seqRes.to = requiredFrames + sequence.to;
    }
    return seqRes;
  }

  function progress(elapsedFrames: number) {
    const frameProgress = elapsedFrames < 0 ? requiredFrames : elapsedFrames;
    allAnimations.forEach((animation) => {
      computeAnimation(frameProgress, animation);
    });
    return state;
  }

  function computeAnimation(frameProgress: number, animation: RegisteredTimelineAnimation) {
    if (frameProgress === 0) {
      setCacheAndValues(animation, 0, animation.initialValues);
      return;
    } else if (frameProgress === requiredFrames) {
      setCacheAndValues(
        animation,
        1,
        Array.isArray(animation.sequences) ? animation.sequences[animation.sequences.length - 1].values : animation.sequences.values,
      );
      return;
    }
    if (!Array.isArray(animation.sequences)) {
      const easePrgoress = easeOrValue(frameProgress / requiredFrames, animation.sequences.ease);
      setCacheAndValues(
        animation,
        frameProgress / requiredFrames,
        computeValues(
          animation.initialValues,
          animation.sequences.values,
          easePrgoress,
        )
      );
      return;
    }
    let prevState = animation.initialValues;
    const state: { id: number, values: AnimationValues, ease: Ease | undefined } = { id: -1, values: prevState, ease: undefined };
    let normalizedProgress = 1;

    let i = 0;
    while (i < animation.sequences.length && frameProgress > animation.sequences[i].from!) {
      i++;
    }
    if (i > 0) {
      const sequence = animation.sequences[i - 1];
      if (sequence.to! > frameProgress) {
        const duration = sequence.to! - sequence.from!;
        normalizedProgress = (frameProgress - sequence.from!) / duration;
      }
      state.values = animation.sequences[i - 1].values;
      state.ease = animation.sequences[i - 1].ease;
      if (sequence.onStart) {
        sequence.onStart();
        sequence.onStart = undefined;
      }
      if (i > 1) {
        prevState = animation.sequences[i - 2].values;
      } else {
        prevState = animation.initialValues;
      }
    }
    const easedProgess = easeOrValue(normalizedProgress, state.ease);
    setCacheAndValues(animation, frameProgress/requiredFrames, computeValues(
      prevState,
      state.values,
      easedProgess
    ));
  }

  function getCache(title: string) {
    return allAnimations.find((animation) => animation.key === title)?.cache;
  }

  function getLastCache() {
    return lastCache.value;
  }

  function setCacheAndValues(animation: RegisteredTimelineAnimation, progress: number, values: AnimationValues) {
    lastCache.value = { ...lastCache.value, ...values };
    animation.cache.lastValue = values;
    animation.cache.progress = progress;
    setValues(animation, animation.cache.lastValue);
  }

  const state: AnimationTimeline = {
    progress,
    add,
    animations: allAnimations,
    getCache,
    getLastCache,
  }

  return state;
}

function computeValues(
  from: AnimationValues,
  to: AnimationValues,
  normalizedProgress: number
): AnimationValues {
  const res: AnimationValues = { ...to, ...from };
  for (const key in from) {
    const typedKey = key as keyof AnimationValues;
    const toValue = to[typedKey];
    const fromValue = from[typedKey];
    if (toValue !== undefined && fromValue !== undefined) {
      res[typedKey] = (fromValue + normalizedProgress * (toValue - fromValue));
    }
  }
  return res;
}

function easeOrValue(value: number, ease?: Ease) {
  return ease ? cubicBezier(value, ease[0], ease[1], ease[2], ease[3]) : value;
}

function setValues(animation: RegisteredTimelineAnimation, values: AnimationValues) {
  if (!animation.element) {
    return;
  }
  const cssValues = transformValues(values) as Record<string, string>;
  for (const key in cssValues) {
    const value = cssValues[key];
    if (value === undefined) {
      continue;
    }
    animation.element.style.setProperty(key, value);
  }
}

function transformValues(values: AnimationValues) {
  const scale = values.scale !== undefined ? `scale(${values.scale})` : "";
  const scaleX = values.scaleX !== undefined ? `scaleX(${values.scaleX})` : "";
  const scaleY = values.scaleY !== undefined ? `scaleY(${values.scaleY})` : "";
  const rotate = values.rotate !== undefined ? `rotate(${values.rotate}deg)` : "";
  const x = values.x !== undefined ? `translateX(${values.x}px)` : "";
  const y = values.y !== undefined ? `translateY(${values.y}px)` : "";
  return {
    transform: (scale || scaleX || scaleY || rotate || x || y) ? `${x} ${y} ${scaleX} ${scaleY} ${scale} ${rotate}` : undefined,
    opacity: values.opacity !== undefined ? `${values.opacity}%` : undefined,
  };
}

type AnimationValuesBySteps = Partial<Record<AnimatedProperties, number[]>>;
type AnimationByStepsOptions = {
  ease?: Ease;
  duration: number;
};

export function animationSteps(
  steps: AnimationValuesBySteps,
  options: AnimationByStepsOptions
) {
  return (elapsedTicks: number) => {
    const t = easeOrValue(
      (options.duration - Math.max(options.duration - elapsedTicks, 0)) /
      options.duration,
      options.ease
    ); // [0,1]
    const values: AnimationValues = {};

    for (const stepKey in steps) {
      const stepValues = steps[stepKey as AnimatedProperties];
      if (!stepValues || stepValues.length === 0) {
        continue;
      }
      if (stepValues.length === 1) {
        values[stepKey as AnimatedProperties] = stepValues[0];
        continue;
      }
      const currentStep = Math.floor(t * (stepValues.length - 1)); // -1 because case 0 is initial
      if (currentStep === stepValues.length - 1) {
        // last frame
        values[stepKey as AnimatedProperties] =
          stepValues[stepValues.length - 1];
        continue;
      }
      const from = stepValues[currentStep];
      const to = stepValues[currentStep + 1];
      const progress = t * (stepValues.length - 1) - currentStep; // [0,1]
      values[stepKey as AnimatedProperties] = from + (to - from) * progress;
    }

    return transformValues(values);
  };
}
