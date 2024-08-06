import { inPx, numberWithCommas } from "@repo/lib";
import { GlobalAnimation } from "../store/animationStore";
import _ from "lodash";
import gsap from "gsap";

const addTrophy = createImageParticule("/trophy.png");
const addMoney = createImageParticule("/money.png");
const addKey = createImageParticule("/key.png");

function createImageParticule(src: string) {
  return (container: HTMLElement) => {
    const size = 32;
    const trophy = document.createElement("img");
    trophy.src = src;
    trophy.style.position = "absolute";
    trophy.style.left = "0";
    trophy.style.top = "0";
    trophy.style.width = inPx(size);
    trophy.style.zIndex = "100";
    container.appendChild(trophy);
    return trophy;
  }
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

function orchestrateTrophyAnimation({
  origin,
  target,
  container,
  animationObject,
  layoutId,
  inputQuerySelector,
  inputValueQuerySelector,
  createElement,
  delay,
  progressBarQuerySelector,
}: {
  origin: HTMLElement;
  target: HTMLElement;
  container: HTMLElement;
  animationObject: GlobalAnimation;
  layoutId: string;
  inputQuerySelector: string;
  inputValueQuerySelector: string;
  createElement: (element: HTMLElement) => HTMLElement;
  delay: number;
  progressBarQuerySelector?: string;
}) {
  const elements: HTMLElement[] = [];
  const originRect = origin.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const halfSize = 16;
  const x = originRect.left + originRect.width / 2 - halfSize;
  const y = originRect.top + originRect.height / 2 - halfSize;
  const targetX = targetRect.left + targetRect.width / 2 - halfSize;
  const targetY = targetRect.top + targetRect.height / 2 - halfSize;
  const tl = gsap.timeline({
    onComplete: () => {
      animationObject.onEnd?.();
      elements.forEach((elt) => {
        container.removeChild(elt);
      });
    }
  }).delay(delay);
  const amountOfParticles = Math.min(10, animationObject.amount);
  const lowAmountOfParticles = amountOfParticles <= 5;
  _.range(amountOfParticles).forEach((i) => {
    const elt = createElement(container);
    animateTrophy(tl, elt, x, y, targetX, targetY, lowAmountOfParticles ? (i*2) : i)
    elements.push(elt);
  });
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
    elements.push(trophyCountClone);
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
      amountOfParticles,
    );
    const bar = progressBarQuerySelector ? trophyCountClone.querySelector(progressBarQuerySelector) as HTMLElement : null;
    _.range(numberOfIncrements).forEach((i) => {
      tl.to(
        input,
        {
          scale: 1.05,
          duration: 0.04,
          ease: "power1.in",
          delay: 0.6 + i * 0.2,
          onComplete: () => {
            const value = Math.round(
              animationObject.previousValue +
              (animationObject.amount / numberOfIncrements) * (i + 1)
            );
            inputTrophies.innerHTML = numberWithCommas(value);
            if (bar) {
              bar.style.width = `${(value / (animationObject.previousValue + animationObject.amount)) * 100}%`;
            }
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

export function startContainerAnimation({
  animationObject,
  delay = 0,
}: {
  animationObject: GlobalAnimation;
  delay?: number;
}) {
  const container = document.getElementById("animationsContainer");
  if (!container) return;

  if (animationObject.type === "money") {
    const origin =
      animationObject.originRef ?? document.getElementById("battleButton");
    const target = document.getElementById("moneyCountIcon");

    if (origin && target) {
      orchestrateTrophyAnimation({
        origin,
        target,
        container,
        animationObject,
        layoutId: "moneyCount",
        inputQuerySelector: '[x-id="moneyCountInput"]',
        inputValueQuerySelector: '[x-id="moneyCountInputValue"]',
        createElement: addMoney,
        delay,
      });
    }
  }
  if (animationObject.type === "trophy") {
    const origin = document.getElementById("battleButton");
    const target = document.getElementById("trophyCountIcon");

    if (origin && target) {
      orchestrateTrophyAnimation({
        origin,
        target,
        container,
        animationObject,
        layoutId: "trophyCount",
        inputQuerySelector: '[x-id="trophyCountInput"]',
        inputValueQuerySelector: '[x-id="trophyCountInputTrophies"]',
        createElement: addTrophy,
        delay,
      });
    }
  }
  if (animationObject.type === "keys") {
    const target = document.getElementById("keysCountIcon");

    if (animationObject.originRef && target) {
      orchestrateTrophyAnimation({
        origin: animationObject.originRef,
        target,
        container,
        animationObject,
        layoutId: "keysCount",
        inputQuerySelector: '[x-id="keysCountInput"]',
        inputValueQuerySelector: '[x-id="keysCountInputValue"]',
        createElement: addKey,
        delay,
        progressBarQuerySelector: "#keysCountProgressBar",
      });
    }
  }
}