import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Button, { ButtonProps } from "./Button";
import { createPortal } from "react-dom";
import { inPx } from "@repo/lib";
import useOnClickOutside from "../lib/useOnClickOutside";
import { RemoveScroll } from "react-remove-scroll";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface PopoverContextValue {
  isOpen: boolean;
  toggleOpen: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

// context
const PopoverContext = React.createContext<PopoverContextValue | null>(null);

// provider
interface PopoverProps {
  children: React.ReactNode;
}
export function Popover({ children }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <PopoverContext.Provider
      value={{
        isOpen,
        toggleOpen,
        triggerRef,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

// trigger
type PopoverTriggerProps = Omit<ButtonProps, "action">;
export function PopoverTrigger(props: PopoverTriggerProps) {
  const { triggerRef, toggleOpen } = React.useContext(
    PopoverContext
  ) as PopoverContextValue;

  return <Button {...props} innerRef={triggerRef} action={toggleOpen} />;
}

// content
interface PopoverPortalProps {
  children: React.ReactNode;
  position?: Position;
  wrapper?: React.RefObject<HTMLElement>;
}

export function PopoverPortal({
  children,
  position = "bottom",
  wrapper,
}: PopoverPortalProps) {
  const { triggerRef, isOpen, toggleOpen } = useContext(
    PopoverContext
  ) as PopoverContextValue;
  const [usingPosition, setUsingPosition] = useState(position);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(contentRef, toggleOpen, { watching: isOpen });

  const limitsElement = wrapper?.current?.getBoundingClientRect() ?? {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth,
  };

  useEffect(() => {
    if (!triggerRef.current || !isOpen) return;
    return trackElementPosition(triggerRef.current, testAndSetPosition);
  }, [triggerRef.current, isOpen]);

  useLayoutEffect(() => {
    testAndSetPosition();
    appearAnimation();
  }, [isOpen]);

  function testAndSetPosition() {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;
    const { x, y } = getPosition(
      position,
      triggerRef.current,
      contentRef.current
    );
    const { height, width } = contentRef.current.getBoundingClientRect();
    if (position === "top" && y < limitsElement.top) {
      updatePosition("bottom");
    } else if (position === "bottom" && y + height > limitsElement.bottom) {
      updatePosition("top");
    } else if (position === "left" && x < limitsElement.left) {
      updatePosition("right");
    } else if (position === "right" && x + width > limitsElement.right) {
      updatePosition("left");
    } else {
      updatePosition(position);
    }
  }

  function updatePosition(position: Position) {
    if (!triggerRef.current || !contentRef.current) return;
    const { x, y } = getPosition(
      position,
      triggerRef.current,
      contentRef.current
    );
    contentRef.current.style.left = inPx(x);
    contentRef.current.style.top = inPx(y);
    setUsingPosition(position);
  }

  const { contextSafe } = useGSAP();
  const appearAnimation = contextSafe(() => {
    if (!animationRef.current) {
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(
      animationRef.current,
      { scale: 0 },
      {
        scale: 1.05,
        ease: "power1.in",
        duration: 0.2,
      }
    );
    tl.to(animationRef.current, {
      scale: 1,
      duration: 0.15,
      ease: "power1.out",
    });
  });

  if (!isOpen) return null;

  if (!triggerRef.current) {
    return null;
  }

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none overflow-y-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-slate-800 opacity-60" />
      <div className="absolute" ref={contentRef}>
        <div
          style={{
            transformOrigin: {
              top: "bottom",
              bottom: "top",
              left: "right",
              right: "left",
            }[usingPosition],
          }}
          ref={animationRef}
        >
          <RemoveScroll>
            <div className="flex justify-center items-center bg-slate-100 pointer-events-auto rounded-sm">
              <ArrowBox position={usingPosition} />
              {children}
            </div>
          </RemoveScroll>
        </div>
      </div>
    </div>,
    document.body
  );
}

function trackElementPosition(element: HTMLElement, callback: () => void) {
  let { x, y } = element.getBoundingClientRect();
  let id = requestAnimationFrame(checkChanges);
  function checkChanges() {
    const r = element.getBoundingClientRect();
    if (r.x !== x || r.y !== y) {
      callback();
      x = r.x;
      y = r.y;
    }
    id = requestAnimationFrame(checkChanges);
  }
  return () => cancelAnimationFrame(id);
}

export type Position = "top" | "bottom" | "left" | "right";

function getPosition(
  position: Position,
  element: HTMLElement,
  content: HTMLElement
) {
  switch (position) {
    case "top":
      return getTopCenterPosition(element, content);
    case "bottom":
      return getBottomCenterPosition(element, content);
    case "left":
      return getLeftCenterPosition(element, content);
    case "right":
      return getRightCenterPosition(element, content);
  }
}

function getTopCenterPosition(element: HTMLElement, content: HTMLElement) {
  const { x, y, width } = element.getBoundingClientRect();
  const contentBounding = content.getBoundingClientRect();
  return {
    x: x + width / 2 - contentBounding.width / 2,
    y: y - contentBounding.height,
  };
}

function getBottomCenterPosition(element: HTMLElement, content: HTMLElement) {
  const { x, y, width, height } = element.getBoundingClientRect();
  const contentBounding = content.getBoundingClientRect();
  return {
    x: x + width / 2 - contentBounding.width / 2,
    y: y + height,
  };
}

function getLeftCenterPosition(element: HTMLElement, content: HTMLElement) {
  const { x, y, height } = element.getBoundingClientRect();
  const contentBounding = content.getBoundingClientRect();
  return {
    x: x - contentBounding.width,
    y: y + height / 2 - contentBounding.height / 2,
  };
}

function getRightCenterPosition(element: HTMLElement, content: HTMLElement) {
  const { x, y, width, height } = element.getBoundingClientRect();
  const contentBounding = content.getBoundingClientRect();
  return {
    x: x + width,
    y: y + height / 2 - contentBounding.height / 2,
  };
}

function ArrowBox({ position }: { position: Position }) {
  const styles = {
    top: {
      top: "100%",
      bottom: "auto",
      left: "50%",
      transform: "translate(-50%, 0) rotate(180deg)",
    },
    bottom: {
      top: "auto",
      bottom: "100%",
      left: "50%",
      transform: "translate(-50%, 0)",
    },
    left: {
      top: "50%",
      left: "98%",
      transform: "translate(0, -50%) rotate(90deg)",
    },
    right: {
      top: "50%",
      right: "98%",
      transform: "translate(0, -50%) rotate(-90deg)",
    },
  };

  return (
    <div
      className="absolute w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-slate-100"
      style={styles[position]}
    />
  );
}
