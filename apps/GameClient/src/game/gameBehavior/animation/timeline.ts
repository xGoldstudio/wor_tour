import { cubicBezier } from "@repo/ui";

type AnimatedProperties = "x" | "y" | "scale" | "opacity";

type AnimationValues = Partial<Record<AnimatedProperties, number>>;

type Ease = [number, number, number, number];

interface Sequence {
  from: number;
  to: number;
  values: AnimationValues;
  ease?: Ease;
}

export default function animationTimeline(
  initialValues: AnimationValues,
  sequences: Sequence[]
) {
  return (elapsedFrames: number, requiredFrames: number) => {
    const remainingFrames = requiredFrames - elapsedFrames;
    for (let i = 0; i < sequences.length; ++i) {
      const seq = sequences[i];
      let normalizedProgress: null | number = null;
      if (
        seq.from < 0 &&
        -seq.from >= remainingFrames &&
        -seq.to <= remainingFrames
      ) {
        normalizedProgress = (seq.from + remainingFrames) / (seq.from - seq.to);
      }
      if (
        seq.from >= 0 &&
        seq.from <= elapsedFrames &&
        seq.to >= elapsedFrames
      ) {
        normalizedProgress = (elapsedFrames - seq.from) / (seq.to - seq.from);
      }
      if (normalizedProgress !== null) {
        return transformValues(
          computeValues(
            getValues(i),
            seq.values,
            easeOrValue(normalizedProgress, seq.ease)
          )
        );
      }
    }
    return transformValues({});
  };

  function getValues(index: number) {
    return index === 0 ? initialValues : sequences[index - 1].values;
  }

  function computeValues(
    from: AnimationValues,
    to: AnimationValues,
    normalizedProgress: number
  ) {
    const res: AnimationValues = { ...to, ...from };
    for (const key in from) {
      const typedKey = key as keyof AnimationValues;
      const toValue = to[typedKey];
      const fromValue = from[typedKey];
      if (toValue !== undefined && fromValue !== undefined) {
        res[typedKey] = fromValue + normalizedProgress * (toValue - fromValue);
      }
    }
    return res;
  }
}

function easeOrValue(value: number, ease?: Ease) {
  return ease ? cubicBezier(value, ease[0], ease[1], ease[2], ease[3]) : value;
}

function transformValues(values: AnimationValues) {
  const scale = values.scale !== undefined ? `scale(${values.scale}%)` : "";
  const x = values.x !== undefined ? `translateX(${values.x}px)` : "";
  const y = values.y !== undefined ? `translateY(${values.y}px)` : "";
  return {
    transform: `${scale} ${x} ${y}`,
    opacity: values.opacity !== undefined ? `${values.opacity}%` : "",
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
