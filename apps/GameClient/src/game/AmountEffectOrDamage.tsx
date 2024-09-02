import { useRef } from "react";
import {
	CardDamagResolveEvent,
	HealCardEvent, PlayerDamageResolveEvent
} from "game_engine";
import { useRegisterAnimation, useGameEventListener } from "@repo/ui";
import { animationTimeline, getXCenterBoudingOfElement, getYCenterBoudingOfElement, inPx } from "@repo/lib";

export default function AmountEffectOrDamage() {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const { registerAnimation } = useRegisterAnimation();
  useGameEventListener({
    type: "playerDamageResolve",
    action: (e, state) => {
      const event = e as PlayerDamageResolveEvent;
			const cardPosition = state.getCardPosition(event.initiator.initiator.instanceId);
			if (cardPosition === null) return;
			runAnimation(
				getHpBar(event.initiator.isPlayer),
				getCard(cardPosition.isPlayerCard, cardPosition.position),
				-event.initiator.damage,
			);
    },
  });
	useGameEventListener({
    type: "cardDamageResolve",
    action: (e, state) => {
      const event = e as CardDamagResolveEvent;
			const cardPosition = state.getCardPosition(event.initiator.instanceId);
			if (cardPosition === null) return;
			const card = getCard(cardPosition.isPlayerCard, cardPosition.position);
			runAnimation(
				card,
				card,
				-event.damage,
			);
    },
  });
	useGameEventListener({
    type: "healCard",
    action: (e, state) => {
      const event = e as HealCardEvent;
			const cardPosition = state.getCardPosition(event.instanceId);
			if (cardPosition === null) return;
			const card = getCard(cardPosition.isPlayerCard, cardPosition.position);
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
			dmg < 0 ? "text-[red]" : "text-[green]",
			"drop-shadow-[2px_1px_1px_black]",
			"text-2xl",
			"transform",
			"z-30",
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
