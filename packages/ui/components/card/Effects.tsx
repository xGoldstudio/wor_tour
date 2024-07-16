import { CardEffects } from "@repo/types";
import { EffectLayoutData, getImageEffects } from "../../lib/getImageEffects";
import Cover from "../Cover";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { inPx } from "../../lib/utils";

export default function Effects({
  effects,
  size,
  showDesc,
}: {
  effects: CardEffects;
  size: number;
  showDesc?: boolean;
}) {
  const effectToShow = getImageEffects(effects);

  return (
    <div
      className="flex flex-col"
      style={{ padding: inPx(8 * size), gap: inPx(8 * size) }}
    >
      {effectToShow.map((effect) => (
        <EffectLayout key={effect.title} effect={effect} size={size} showDesc={showDesc} />
      ))}
    </div>
  );
}

function EffectLayout({
  effect,
  size,
  showDesc,
}: {
  effect: EffectLayoutData;
  size: number;
  showDesc?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const illustrationSize = 36 * size;
  const wrapperSize = 42 * size;
  const fontSize = `${0.875 * size}rem`;
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
        src={`/${effect.src}`}
        width={illustrationSize}
        height={illustrationSize}
        className="relative drop-shadow-[1px_1px_1px_black]"
      />
      {effect.amount !== null && (
        <p
          className="absolute bottom-0 left-1/2 -translate-x-1/2 font-semibold drop-shadow-[1px_1px_1px_black]"
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
  effect: EffectLayoutData;
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