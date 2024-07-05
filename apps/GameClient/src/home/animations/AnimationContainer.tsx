import { useEffect, useRef, useState } from "react";
import useAnimationStore, { GlobalAnimation } from "../store/animationStore";
import gsap from "gsap";
import _ from "lodash";
import { inPx, numberWithCommas } from "@repo/ui";
import usePlayerStore from "../store/playerStore";
import { createPortal } from "react-dom";

function addTrophy(container: HTMLElement) {
  const size = 32;
  const trophy = document.createElement("img");
  trophy.src = "/trophy.png";
  trophy.style.position = "absolute";
  trophy.style.left = "0";
  trophy.style.top = "0";
  trophy.style.width = inPx(size);
  trophy.style.zIndex = "100";
  container.appendChild(trophy);
  return trophy;
}

function addMoney(container: HTMLElement) {
  const size = 32;
  const money = document.createElement("img");
  money.src = "/money.png";
  money.style.position = "absolute";
  money.style.left = "0";
  money.style.top = "0";
  money.style.width = inPx(size);
  money.style.zIndex = "100";
  container.appendChild(money);
  return money;
}

function animateTrophy(
  tl: gsap.core.Timeline,
  trophy: HTMLElement,
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  i: number
) {
  const randomX = _.random(-100, 100);
  const randomY = _.random(-50, 50);
  tl.fromTo(
    trophy,
    { x, y, opacity: 0 },
    {
      x: x + randomX,
      y: y + randomY,
      opacity: 1,
      duration: 0.5,
      ease: "power2.inOut",
      delay: i * 0.05,
    },
    "start"
  );
  tl.to(trophy, { scale: 1.5, delay: i * 0.05, duration: 0.1 }, "scaleUp");
  tl.to(trophy, { scale: 1, delay: i * 0.05, duration: 0.1 }, "scaleDown");
  tl.to(
    trophy,
    {
      x: targetX,
      y: targetY,
      duration: 0.6 + i * 0.05,
      ease: "power1.in",
      delay: i * 0.05,
    },
    "second"
  );
  tl.to(
    trophy,
    {
      opacity: 0,
      duration: 0.2,
      ease: "power2.inOut",
      delay: 0.5 + i * 0.1,
    },
    "second"
  );
}

function clearContainer(container: HTMLElement) {
  container.innerHTML = "";
}

function orchestrateTrophyAnimation({
  origin,
  target,
  container,
  nextAnimation,
  animationObject,
  layoutId,
  inputQuerySelector,
  inputValueQuerySelector,
  createElement,
  setWorldsModalOpen,
}: {
  origin: HTMLElement;
  target: HTMLElement;
  container: HTMLElement;
  nextAnimation: () => void;
  animationObject: GlobalAnimation;
  layoutId: string;
  inputQuerySelector: string;
  inputValueQuerySelector: string;
  createElement: (element: HTMLElement) => HTMLElement;
  setWorldsModalOpen: (value: "tier" | "world" | false) => void;
}) {
  const originRect = origin.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const halfSize = 16;
  const x = originRect.left + originRect.width / 2 - halfSize;
  const y = originRect.top + originRect.height / 2 - halfSize;
  const targetX = targetRect.left + targetRect.width / 2 - halfSize;
  const targetY = targetRect.top + targetRect.height / 2 - halfSize;
  const tl = gsap.timeline({
    onComplete: () => {
      nextAnimation();
      if (animationObject.type === "money") {
        usePlayerStore.getState().addGold(animationObject.amount);
      } else if (animationObject.type === "trophy") {
        setWorldsModalOpen(usePlayerStore.getState().setTrophies(animationObject.amount));
      }
    },
  });
  const amountOfParticles = Math.min(10, animationObject.amount);
  _.range(amountOfParticles).forEach((i) =>
    animateTrophy(tl, createElement(container), x, y, targetX, targetY, i)
  );
  const trophyCount = document.getElementById(layoutId);
  if (trophyCount) {
    // copy the trophy count and add it to the container at the same position
    const trophyCountClone = trophyCount.cloneNode(true) as HTMLElement;
    trophyCountClone.style.position = "fixed";
    const x = trophyCount.getBoundingClientRect().left;
    const y = trophyCount.getBoundingClientRect().top;
    trophyCountClone.style.left = inPx(x);
    trophyCountClone.style.top = inPx(y);
    container.appendChild(trophyCountClone);
    const input =
      trophyCountClone.querySelector(inputQuerySelector) ?? trophyCountClone;
    const inputTrophies = trophyCountClone.querySelector(
      inputValueQuerySelector
    );
    if (!inputTrophies || !input) {
      return;
    }
    inputTrophies.innerHTML = numberWithCommas(animationObject.previousValue);
    const numberOfIncrements = Math.min(
      5,
      Math.max(1, Math.floor(amountOfParticles / 2))
    );
    _.range(numberOfIncrements).forEach((i) => {
      tl.to(
        input,
        {
          scale: 1.05,
          duration: 0.04,
          ease: "power1.in",
          delay: 0.6 + i * 0.2,
          onComplete: () => {
            inputTrophies.innerHTML = numberWithCommas(
              animationObject.previousValue +
                (animationObject.amount / numberOfIncrements) * (i + 1)
            );
          },
        },
        "second"
      );
      tl.to(
        input,
        {
          scale: 1,
          duration: 0.04,
          ease: "power1.in",
          delay: 0.64 + i * 0.2,
        },
        "second"
      );
    });
    // animate the trophy count to the target position
  }
}

function animation({
  animationObject,
  nextAnimation,
  container,
  setWorldsModalOpen,
}: {
  animationObject: GlobalAnimation;
  nextAnimation: () => void;
  container: HTMLElement;
  setWorldsModalOpen: (value: "tier" | "world" | false) => void;
}) {
  if (animationObject.type === "money") {
    const origin = document.getElementById("battleButton");
    const target = document.getElementById("moneyCountIcon");

    if (origin && target) {
      orchestrateTrophyAnimation({
        origin,
        target,
        container,
        nextAnimation,
        animationObject,
        layoutId: "moneyCount",
        inputQuerySelector: '[x-id="moneyCountInput"]',
        inputValueQuerySelector: '[x-id="moneyCountInputValue"]',
        createElement: addMoney,
        setWorldsModalOpen,
      });
    }
    // do money animation
  }
  if (animationObject.type === "trophy") {
    const origin = document.getElementById("battleButton");
    const target = document.getElementById("trophyCountIcon");

    if (origin && target) {
      orchestrateTrophyAnimation({
        origin,
        target,
        container,
        nextAnimation,
        animationObject,
        layoutId: "trophyCount",
        inputQuerySelector: '[x-id="trophyCountInput"]',
        inputValueQuerySelector: '[x-id="trophyCountInputTrophies"]',
        createElement: addTrophy,
        setWorldsModalOpen,
      });
    }
  }
}

export default function AnimationContainer({
  setWorldsModalOpen,
}: {
  setWorldsModalOpen: (value: "tier" | "world" | false) => void;
}) {
  const { animationsQueue, clearQueue } = useAnimationStore((state) => ({
    animationsQueue: state.queue,
    clearQueue: state.clearQueue,
  }));
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const container = useRef<HTMLDivElement | null>(null);
  const appContainer = document.getElementById("app");

  useEffect(() => {
    if (
      appContainer &&
      container.current !== null &&
      animationsQueue.length > 0 &&
      !isAnimating
    ) {
      setIsAnimating(true);
      const copyQueue = clearQueue().reverse();
      const nextAnimation = () => {
        if (container.current === null) {
          return;
        }
        const currentAnimation = copyQueue.pop();
        if (currentAnimation) {
          animation({
            animationObject: currentAnimation,
            nextAnimation,
            container: container.current,
            setWorldsModalOpen: setWorldsModalOpen,
          });
        } else {
          setIsAnimating(false);
          clearContainer(container.current);
        }
      };
      nextAnimation();
    }
  }, [animationsQueue, isAnimating, container, appContainer]);

  if (!appContainer) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 pointer-events-none"
      id="animationsContainer"
      ref={container}
    ></div>,
    appContainer
  );
}
