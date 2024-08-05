import { inPx, numberWithCommas } from "@repo/lib";
import { GlobalAnimation } from "../store/animationStore";
import _ from "lodash";

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
}) {
  const elements: HTMLElement[] = [];
  const originRect = origin.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const halfSize = 16;
  const x = originRect.left + originRect.width / 2 - halfSize;
  const y = originRect.top + originRect.height / 2 - halfSize;
  const targetX = targetRect.left + targetRect.width / 2 - halfSize;
  const targetY = targetRect.top + targetRect.height / 2 - halfSize;
  const tl = gsap.timeline({ onComplete: () => {
    animationObject.onEnd?.();
    elements.forEach((elt) => {
      container.removeChild(elt);
    });
  } }).delay(delay);
  const amountOfParticles = Math.min(10, animationObject.amount);
  _.range(amountOfParticles).forEach((i) => {
    const elt = createElement(container);
    animateTrophy(tl, elt, x, y, targetX, targetY, i)
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
              Math.round(
                animationObject.previousValue +
                  (animationObject.amount / numberOfIncrements) * (i + 1)
              )
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
}