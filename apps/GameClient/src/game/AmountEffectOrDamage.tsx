import { useRef } from "react";
import {
	useRegisterAnimation
} from "./gameBehavior/animation/useGameSyncAnimation";
import useGameEventListener from "./gameBehavior/useGameEventListener";
import {
	CardDamagResolveEvent,
	HealCardEvent, PlayerDamageResolveEvent
} from "./gameBehavior/useGameEvents";
import {
	getXCenterBoudingOfElement,
	getYCenterBoudingOfElement,
	inPx,
} from "@repo/ui";
import animationTimeline from "./gameBehavior/animation/timeline";

export default function AmountEffectOrDamage() {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const { registerAnimation } = useRegisterAnimation();
  useGameEventListener({
    type: "playerDamageResolve",
    action: (e) => {
      const event = e as PlayerDamageResolveEvent;
			runAnimation(
				getHpBar(event.initiator.isPlayer),
				getCard(event.initiator.isPlayer, event.initiator.initiator.cardPosition),
				-event.initiator.damage,
			);
    },
  });
	useGameEventListener({
    type: "cardDamageResolve",
    action: (e) => {
      const event = e as CardDamagResolveEvent;
			const card = getCard(event.initiator.isPlayerCard, event.initiator.cardPosition);
			runAnimation(
				card,
				card,
				-event.initiator.amount,
			);
    },
  });
	useGameEventListener({
    type: "healCard",
    action: (e) => {
      const event = e as HealCardEvent;
			const card = getCard(event.isPlayerCard, event.cardPosition);
			runAnimation(
				card,
				card,
				event.amount,
			);
    },
  });

	function runAnimation(target: HTMLElement | null, initiator: HTMLElement | null, dmg: number) {
		if (!target || !initiator || !wrapperRef) {
			return;
		}
		const dmgText = appendText(target, initiator, dmg);
		registerAnimation({
			duration: 40,
			computeStyle: animationTimeline(40).add(
				dmgText,
				{ y: 0, opacity: 100 },
				{ values: { y: -40, opacity: 0 }, ease: [0, 0.42, 1, 1]}
			).progress,
			onEnd: () => {
				dmgText.remove();
			}
		});
	}

	function getCard(isPlayer: boolean, cardPosition: number) {
		return document.getElementById(
			`card_${isPlayer}_${cardPosition}`
		);
	}

	function getHpBar(isPlayer: boolean) {
		return document.getElementById(
			`hpBar_${isPlayer}`
		);
	}

	function appendText(target: HTMLElement, init: HTMLElement, dmg: number) {
		const dmgText = document.createElement("div");
		// add class
		dmgText.classList.add(
			"absolute",
			"font-bold",
			dmg < 0 ? "text-[red]" : "text-[blue]",
			"drop-shadow-[2px_1px_1px_black]",
			"text-2xl",
			"transform",
		);
		dmgText.appendChild(document.createTextNode(`${dmg}`));
		wrapperRef.current?.appendChild(dmgText);
		dmgText.style.left = inPx(getXCenterBoudingOfElement(init) - dmgText.getBoundingClientRect().width / 2);
		dmgText.style.top = inPx(getYCenterBoudingOfElement(target) - dmgText.getBoundingClientRect().height / 2);
		return dmgText;
	}

  return (
    <div
      className="left-0 fixed w-full h-full pointer-events-none z-20"
      ref={wrapperRef}
    ></div>
  );
}
