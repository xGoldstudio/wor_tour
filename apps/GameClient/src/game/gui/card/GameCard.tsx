import CardBorder, {
  CardContentIllustartion,
  InnerBord,
} from "../../../../../../packages/ui/components/card/CardBorder";
import { InGameCardType } from "@/game/stores/gameStateStore";
import { CardEffects } from "@repo/types";
import { getImageEffects, numberWithCommas } from "@repo/ui";
import { useSyncGameAnimation } from "@/game/gameBehavior/animation/useGameSyncAnimation";
import animationTimeline from "@/game/gameBehavior/animation/timeline";
import {
  CardDamagResolveEvent,
  CardDestroyedEvent,
  CardStartAttackingEvent,
  FRAME_TIME,
  PlaceCardEvent,
  RemoveEffectEvent,
} from "@/game/gameBehavior/useGameEvents";
import { useRef, useState } from "react";
import useGameEventListener from "@/game/gameBehavior/useGameEventListener";
import { EmptyBar } from "../ManaBar";

function getTranslateY(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return matrix.m42;
}

function GameCard({
  isPlayerCard,
  position,
}: {
  isPlayerCard: boolean;
  position: number;
}) {
  const [card, setCard] = useState<InGameCardType>({
    id: -1,
    instanceId: -1,
    maxHp: 0,
    hp: 0,
    dmg: 1,
    attackSpeed: 1,
    startAttackingTick: null,
    rarity: "common",
    effects: {},
    illustration: "",
    worldIllustration: "",
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const { triggerAnimation: triggerAttackAnimation } = useSyncGameAnimation();
  const { triggerAnimation: triggerBloodAnimation } = useSyncGameAnimation();
  useGameEventListener({
    type: "cardStartAttacking",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card && cardRef.current) {
        cardRef.current.style.display = "block";
        const animationDuration =
          1000 / (card.attackSpeed ?? 1) / FRAME_TIME - 1;
        triggerAttackAnimation({
          replace: true,
          duration: animationDuration,
          computeStyle: animationTimeline(
            1000 / (card.attackSpeed ?? 1) / FRAME_TIME
          )
            .add(
              cardRef.current.querySelector<HTMLElement>(".animationProgress"),
              { scaleY: 1 },
              { values: { scaleY: 0 } }
            )
            .add(cardRef.current, { scale: 1.08, y: isPlayerCard ? -15 : 15 }, [
              {
                from: 0,
                to: 15,
                ease: [0, 0.42, 1, 1],
                values: { scale: 1, y: 0 },
              },
              {
                from: -35,
                to: -5,
                ease: [0, 1, 1, 1],
                values: { scale: 1.08, y: isPlayerCard ? 15 : -15 },
              },
              {
                ease: [0, 0.42, 1, 1],
                values: { scale: 1.08, y: isPlayerCard ? -15 : 15 },
              },
            ]).progress,
        });
      }
    },
    filter: (e) => {
      const event = e as CardStartAttackingEvent;
      return event.cardPosition === position && event.isPlayer === isPlayerCard;
    },
  });
  useGameEventListener({
    type: "placeCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card) {
        setCard(card);
      }
    },
    filter: (e) => {
      const event = e as PlaceCardEvent;
      return (
        event.targetPosition === position && event.isPlayer === isPlayerCard
      );
    },
  });
  useGameEventListener({
    type: "cardDestroyed",
    action: () => {
      if (!cardRef.current) {
        return;
      }
      triggerAttackAnimation({
        replace: true,
        duration: 50,
        computeStyle: animationTimeline(50)
          // y is the current translation y of the ref
          .add(
            cardRef.current,
            { opacity: 100, x: 0, y: getTranslateY(cardRef.current) },
            [
              { values: { opacity: 75, x: 10, y: 0 }, to: 12 },
              { values: { opacity: 50, x: -10, y: 0 }, to: 24 },
              { values: { opacity: 25, x: 10, y: 0 }, to: 36 },
              { values: { opacity: 0, x: 0, y: 0 } },
            ]
          ).progress,
        onEnd: () => {
          if (cardRef.current) {
            cardRef.current.style.display = "none";
          }
        },
      });
    },
    filter: (e) => {
      const event = e as CardDestroyedEvent;
      return (
        event.initiator.cardPosition === position &&
        event.initiator.isPlayerCard === isPlayerCard
      );
    },
  });
  useGameEventListener({
    type: "cardDamageResolve",
    action: () => {
      if (!cardRef.current) {
        return;
      }
      triggerBloodAnimation({
        replace: true,
        duration: 50,
        computeStyle: animationTimeline(50)
          // y is the current translation y of the ref
          .add(
            cardRef.current.querySelector<HTMLElement>(".cardDamage"),
            {
              opacity: 0,
            },
            [
              { values: { opacity: 60 }, to: 20, ease: [0, 0.42, 1, 1] },
              { values: { opacity: 0 }, ease: [0, 0.42, 1, 1] },
            ]
          ).progress,
      });
    },
    filter: (e) => {
      const event = e as CardDamagResolveEvent;
      return (
        event.initiator.cardPosition === position &&
        event.initiator.isPlayerCard === isPlayerCard
      );
    },
  });

  if (!card) {
    return null;
  }

  return (
    <div className="hidden" ref={cardRef}>
      <div className="cardDamage rounded-sm z-10 absolute top-0 w-full h-full bg-gradient-to-b  from-[#FF0000] via-[#ff6e6e] via-[37%] to-[#FF0000] opacity-0 origin-top" />
      <GameCardDesign
        card={card}
        size={2.5}
        isPlayerCard={isPlayerCard}
        position={position}
      >
        <div className="animationProgress absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top" />
      </GameCardDesign>
    </div>
  );
}

export function CardEffectsElements({ position, isPlayerCard }: { position: number, isPlayerCard: boolean }) {
  const [effects, setEffects] = useState<CardEffects>({});

  useGameEventListener({
    type: "placeCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[position];
      if (card === null) {
        return;
      }
      setEffects({ ...card.effects });
    },
    filter: (event) => (event as PlaceCardEvent).isPlayer === isPlayerCard && (event as PlaceCardEvent).targetPosition === position,
  });

  useGameEventListener({
    type: "removeEffect",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[position];
      if (card === null) {
        return;
      }
      setEffects({ ...card.effects });
    },
    filter: (event) => (event as RemoveEffectEvent).isPlayerCard === isPlayerCard && (event as RemoveEffectEvent).cardPosition === position,
  })

  const effectToShow = getImageEffects(effects);

  return (
    <div className="absolute right-1 top-2 flex flex-col gap-2">
      {effectToShow.map((effectSrc) => (
        <div
          key={effectSrc}
        >
          <img src={`/${effectSrc}`} width={32} height={32} />
        </div>
      ))}
    </div>
  );
}

export default GameCard;

interface GameCardDesign {
  size: number;
  children?: React.ReactNode;
  position: number;
  isPlayerCard: boolean;
  card: InGameCardType;
}

export function GameCardDesign({
  size,
  card,
  position,
  isPlayerCard,
  children,
}: GameCardDesign) {
  return (
    <CardBorder rarity={card.rarity} size={size}>
      <div className="w-full h-full grid grid-rows-[auto_37px] gap-1">
        <div className="w-full h-full grow relative">
          <CardContentIllustartion card={card} size={size} />
          {children}
        </div>
        <div className="w-full h-min">
          <InnerBord size={size}>
            <GameCardHpBar
              position={position}
              isPlayerCard={isPlayerCard}
            />
          </InnerBord>
        </div>
        <CardEffectsElements position={position} isPlayerCard={isPlayerCard} />
      </div>
    </CardBorder>
  );
}

function GameCardHpBar({
  position,
  isPlayerCard,
}: {
  position: number;
  isPlayerCard: boolean;
}) {
  const [hp, setHp] = useState(0);
  const hpBarRef = useRef<HTMLDivElement | null>(null);
  const bloodRef = useRef<HTMLDivElement | null>(null);
  const scope = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();

  useGameEventListener({
    type: "placeCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[position];
      if (card === null) {
        return;
      }
      setHp(card.hp);
      const lifeBar = scope.current?.querySelector<HTMLElement>(".lifeBar");
      if (lifeBar) {
        lifeBar.style.transform = `scaleX(${card.hp / card.maxHp})`;
      }
    },
    filter: (event) => (event as PlaceCardEvent).isPlayer === isPlayerCard && (event as PlaceCardEvent).targetPosition === position,
  });

  useGameEventListener({
    type: "cardDamageResolve",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[position];
      if (card === null) {
        return;
      }
      const nextHp = card.hp;
      setHp(nextHp);
      if (scope.current && hpBarRef.current) {
        const lifeBar = scope.current.querySelector<HTMLElement>(".lifeBar");
        if (lifeBar) {
          lifeBar.style.transform = `scaleX(${nextHp / card.maxHp})`;
        }
        hpBarRef.current.innerHTML = numberWithCommas(nextHp);
        triggerAnimation({
          replace: true,
          duration: 50,
          computeStyle: animationTimeline(50)
            .add(hpBarRef.current, { scaleX: 1 }, [
              {
                values: { scaleX: 1.2 },
                ease: [0, 1, 1, 1],
              },
              {
                values: { scaleX: 0.85 },
                from: -30,
                ease: [0, 1, 1, 1],
              },
              {
                values: { scaleX: 1 },
                from: -15,
                ease: [0, 0.42, 1, 1],
              },
            ])
            .add(
              bloodRef.current,
              {
                opacity: 0,
              },
              [
                { values: { opacity: 60 }, to: 20, ease: [0, 0.42, 1, 1] },
                { values: { opacity: 0 }, ease: [0, 0.42, 1, 1] },
              ]
            ).progress,
        });
      }
    },
    filter: (event) => (event as CardDamagResolveEvent).initiator.isPlayerCard === isPlayerCard && (event as CardDamagResolveEvent).initiator.cardPosition === position,
  });

  return (
    <div ref={scope} className="shadow-md grid grid-cols-1 text-sm relative ">
      <EmptyBar>
        <div className="lifeBar w-full h-full absolute origin-left bg-gradient-to-b  from-[#0fad05] via-[#74cc6f] via-[37%] to-[#0fad05]" />
        <div
          className="damageFlashBar w-full h-full absolute origin-left bg-gradient-to-b  from-[#FF0000] via-[#ff6e6e] via-[37%] to-[#FF0000] opacity-0"
          ref={bloodRef}
        />
        <div
          className="w-full h-full absolute origin-left bg-gradient-to-b  from-[#2105ad] via-[#4b429d] via-[37%] to-[#2105ad] duration-500 opacity-0"
          // ref={healScope}
        />
        <p
          className="text-xl text-center text-white font-[stylised] relative"
          ref={hpBarRef}
        >
          {numberWithCommas(hp)}
        </p>
      </EmptyBar>
    </div>
  );
}
