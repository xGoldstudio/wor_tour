function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  // Cubic bezier equation: B(t) = (1-t)^3 * P0 + 3 * (1-t)^2 * t * P1 + 3 * (1-t) * t^2 * P2 + t^3 * P3
  return (
    Math.pow(1 - t, 3) * p0 +
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
}

type AnimationValues = Partial<{
  y: number;
  scale: number;
}>;

export default function animationTimeline(
  initialValues: AnimationValues,
  sequences: {
    from: number;
    to: number;
    values: AnimationValues;
    ease?: [number, number, number, number];
  }[]
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
        normalizedProgress =
          (seq.from + remainingFrames) / (seq.from - seq.to);
      }
      if (
        seq.from >= 0 &&
        seq.from <= elapsedFrames &&
        seq.to >= elapsedFrames
      ) {
        normalizedProgress = (elapsedFrames - seq.from) / (seq.to - seq.from);
      }
      if (normalizedProgress) {
        return transformValues(
          computeValues(
            getValues(i),
            seq.values,
            easeOrValue(normalizedProgress, seq.ease)
          )
        );
      }
    }
    return transformValues({ scale: 100, y: 0 });
  };

  function easeOrValue(value: number, ease?: [number, number, number, number]) {
    return ease
      ? cubicBezier(value, ease[0], ease[1], ease[2], ease[3])
      : value;
  }

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

  function transformValues(values: AnimationValues) {
    return {
      transform: `scale(${values.scale}%) translateY(${values.y}px)`,
    };
  }
}