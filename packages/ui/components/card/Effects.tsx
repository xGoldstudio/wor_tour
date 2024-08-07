import {
  CardState,
  CardStateLayoutData,
  getImageEffects,
  getImageUrl,
  inPx,
  STATES_SRC
} from "@repo/lib";
import Cover from "../Cover";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

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
}: {
  effect: CardStateLayoutData;
  size: number;
  showDesc?: boolean;
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
      style={{ width: `${wrapperSize}px`, height: `${wrapperSize}px` }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
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

  if (!home) {
    return null;
  }

  return createPortal(
    <div
      className="fixed rounded-sm px-2 py-1 bg-slate-900 w-[180px] z-[999999] pointer-events-none drop-shadow-[1px_1px_1px_black] opacity-0 transition duration-300 group-hover:opacity-100"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(10%)",
        top: inPx(effectRef.getBoundingClientRect().top),
        left: inPx(
          effectRef.getBoundingClientRect().left +
            effectRef.getBoundingClientRect().width +
            5
        ),
      }}
    >
      <Cover cardRarity="epic" className="rounded-sm" />
      <h3 className="relative text-md font-semibold">{effect.title}</h3>
      <p className="relative text-xs py-2">{effect.description}</p>
    </div>,
    home
  );
}
