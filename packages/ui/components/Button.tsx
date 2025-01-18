import { CardRarity } from "game_engine";
import { cn } from "../lib/utils";
import textureByRarity from "../lib/textureByRarity";
import { disableDefaultAndPropagation } from "@repo/lib";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export interface ButtonProps {
  children: React.ReactNode;
  action: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  full?: boolean;
  hFull?: boolean;
  small?: boolean;
  className?: string;
  rarity?: CardRarity;
  width?: number;
  unstyled?: boolean;
  innerRef?: React.RefObject<HTMLButtonElement>;
  dontPreventPropagation?: boolean;
  containerClassname?: string;
  onLongPressAction?: (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent
  ) => void;
  isNew?: boolean;
}

export default function Button({
  children,
  action,
  full,
  small,
  disabled,
  className,
  rarity = "rare",
  width,
  unstyled,
  innerRef,
  dontPreventPropagation,
  containerClassname,
  onLongPressAction,
  hFull,
  isNew,
}: ButtonProps) {
  const container = useRef<HTMLDivElement>(null);

  const [tl, setTl] = useState<gsap.core.Timeline>();
  const isPressing = useRef(false);
  const longTouchTimer = useRef<number | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    setTl(tl);
  });

  const { contextSafe } = useGSAP();
  const onActionAnimation = contextSafe(() => {
    if (!container.current || !tl) return;
    tl.clear();
    // having action delayed is not optimal, may need a better solution
    tl.to(container.current, {
      scale: 1.05,
      duration: 0.15,
      ease: "power1.in",
    });
    tl.to(container.current, { scale: 1, duration: 0.15, ease: "power1.out" });
  });
  const onPressAnimation = contextSafe(() => {
    if (!container.current || !tl) return;
    tl.to(container.current, { scale: 0.95, duration: 0.1, ease: "none" });
    tl.play();
  });
  const onReleaseAnimation = contextSafe(() => {
    if (!container.current || !tl) return;
    tl.to(container.current, { scale: 1, duration: 0, ease: "none" });
  });
  function onPress(e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent) {
    isPressing.current = true;
    if (longTouchTimer.current) {
      clearTimeout(longTouchTimer.current);
    }
    if (onLongPressAction) {
      longTouchTimer.current = setTimeout(() => {
        isPressing.current = false;
        onLongPressAction(e);
        longTouchTimer.current = null;
      }, 300);
    }
    onPressAnimation();
  }

  return (
    <button
      onMouseDown={disableDefaultAndPropagation(
        onPress,
        dontPreventPropagation
      )}
      onTouchStart={disableDefaultAndPropagation(
        onPress,
        dontPreventPropagation
      )}
      onMouseLeave={() => {
        onReleaseAnimation();
      }}
      onClick={disableDefaultAndPropagation((e) => {
        longTouchTimer.current && clearTimeout(longTouchTimer.current);
        if (isPressing.current) {
          action(e);
        }
        isPressing.current = false;
        onActionAnimation();
      }, dontPreventPropagation)}
      disabled={disabled}
      className={cn(
        "relative",
        full ? "w-full" : "w-min",
        hFull ? "h-full" : ""
      )}
      ref={innerRef}
    >
      {isNew && !disabled && (
        <span className="flex h-3 w-3 absolute right-0 top-0 z-20 translate-x-1/3 -translate-y-1/3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
        </span>
      )}
      <div
        ref={container}
        className={cn(
          containerClassname ?? "",
          unstyled
            ? ""
            : [
                "rounded-sm overflow-hidden text-nowrap relative z-10 font-semibold shadow-md h-full",
                disabled ? "brightness-50" : "brightness-100",
                rarity === "epic" ? "bg-slate-100" : "bg-slate-300",
              ]
        )}
        style={{
          width: width && !full ? `${width}px` : undefined,
        }}
      >
        {unstyled ? (
          children
        ) : (
          <>
            <div
              className="absolute w-full h-full blur-sm"
              style={{
                backgroundImage: `url(${textureByRarity(rarity)})`,
                backgroundSize: "cover",
                backgroundPositionY: "center",
              }}
            />
            <div
              className={cn(
                "text-slate-900 font-bold h-full flex justify-center items-center relative",
                !small ? "px-12 py-2" : "px-2 py-1",
                className
              )}
            >
              {children}
            </div>
          </>
        )}
      </div>
    </button>
  );
}
