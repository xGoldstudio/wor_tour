import {
  CardState,
  CardStateLayoutData,
  getImageEffects,
  getImageUrl,
  inPx,
  STATES_SRC,
} from "@repo/lib";
import Cover from "../Cover";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function States({
  states,
  size,
  showDesc,
}: {
  states: CardState[];
  size: number;
  showDesc?: boolean;
}) {
  const effectToShow = getImageEffects(states);

  return (
    <div
      className="flex flex-col"
      style={{ padding: inPx(8 * size), gap: inPx(8 * size) }}
    >
      {effectToShow.map((effect) => (
        <EffectLayout
          key={effect.title}
          effect={effect}
          size={size}
          showDesc={showDesc}
        />
      ))}
    </div>
  );
}

export function EffectLayout({
  effect,
  size,
  showDesc,
  onShowDesc,
  onHideShowDesc,
}: {
  effect: CardStateLayoutData;
  size: number;
  showDesc?: boolean;
  onShowDesc?: () => void;
  onHideShowDesc?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const illustrationSize = 32 * size;
  const wrapperSize = 42 * size;
  const fontSize = `${1 * size}rem`;
  const [show, setShow] = useState(false);

  return (
    <div
      ref={ref}
      key={effect.src}
      className="relative flex justify-center items-center rounded-md bg-slate-800 drop-shadow-[1px_1px_1px_black] group"
      style={{
        width: inPx(wrapperSize),
        height: inPx(wrapperSize),
        minHeight: inPx(wrapperSize),
      }}
      onMouseEnter={() => {
        setShow(true);
        onShowDesc?.();
      }}
      onMouseLeave={() => {
        setShow(false);
        onHideShowDesc?.();
      }}
    >
      <Cover cardRarity="rare" className="rounded-md" />
      <img
        src={getImageUrl(STATES_SRC, effect.src)}
        width={illustrationSize}
        height={illustrationSize}
        className="relative drop-shadow-[1px_1px_1px_black]"
      />
      {effect.amount !== null && (
        <p
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-semibold drop-shadow-[1px_1px_1px_black]"
          style={{
            fontSize,
            color: {
              buff: "#00ff00",
              debuff: "#ff0000",
              neutral: "white",
            }[effect.status],
          }}
        >
          {effect.amount}
        </p>
      )}
      {showDesc && ref.current && (
        <EffectDesc effectRef={ref.current} effect={effect} show={show} />
      )}
    </div>
  );
}

function EffectDesc({
  effectRef,
  effect,
  show,
}: {
  effectRef: HTMLDivElement;
  effect: CardStateLayoutData;
  show: boolean;
}) {
  const home = document.body;
  const width = 180;
  const margin = 5;
  const animationDuration = 0.3;

  const [container, setContainer] = useState<HTMLDivElement | undefined>(
    undefined
  );

  const [active, setActive] = useState<"LEFT" | "RIGHT" | false>(false);

  const { contextSafe } = useGSAP({ scope: container });

  function getXAnimation() {
    return active === "LEFT" ? -10 : 10;
  }

  const appear = contextSafe(() => {
    if (!container) return;
    gsap.fromTo(
      container,
      { opacity: 0, x: getXAnimation() },
      { opacity: 1, x: 0, duration: animationDuration }
    );
  });

  const remove = contextSafe(() => {
    if (!container) return;
    gsap.to(container, {
      opacity: 0,
      x: getXAnimation(),
      duration: animationDuration,
      onComplete: () => setActive(false),
    });
  });

  useEffect(() => {
    if (show) {
      if (!active) {
        if ((getLeft() + width) < window.innerWidth) {
          setActive("RIGHT");
        } else {
          setActive("LEFT");
        }
      } else {
        appear();
      }
    } else {
      remove();
    }
  }, [show, container]);

  if (!home || !active) {
    return null;
  }

  function getLeft() {
    if (active === "LEFT") {
      return effectRef.getBoundingClientRect().left - width - margin;
    }
    return (
      effectRef.getBoundingClientRect().left +
      effectRef.getBoundingClientRect().width +
      margin
    );
  }

  return createPortal(
    <div
      className={`fixed w-[${width}px] z-[999999] pointer-events-none bg-slate-900 drop-shadow-[1px_1px_1px_black] px-2 py-1 rounded-sm`}
      style={{
        top: inPx(effectRef.getBoundingClientRect().top),
        left: inPx(getLeft()),
      }}
      ref={(container) => setContainer(container ?? undefined)}
    >
      <Cover cardRarity="epic" className="rounded-sm" />
      <h3 className="relative text-md font-semibold">{effect.title}</h3>
      <p className="relative text-xs py-2">{effect.description}</p>
    </div>,
    home
  );
}
