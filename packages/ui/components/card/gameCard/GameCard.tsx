import {
  CardBorder,
  CardContentIllustartion,
  cn,
  EmptyBar,
  InnerBord,
  useSyncGameAnimation,
} from "@repo/ui";
import { useRef, useState } from "react";
import {
  CardState,
  numberWithCommas,
  animationTimeline,
  inPx,
} from "@repo/lib";
import {
  AddStateEvent,
  CardDamagResolveEvent,
  CardDestroyedEvent,
  CardStartAttackingEvent,
  FRAME_TIME,
  GameStateObject,
  HealCardEvent,
  InGameCardType,
  PlaceCardEvent,
} from "game_engine";
import useGameEventListener from "../useGameEventListener";
import { GameCardEffect } from "./GameCardEffect";

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
    states: [],
    illustration: "",
    worldIllustration: "",
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = useState(false);
  const { triggerAnimation: triggerAttackAnimation } = useSyncGameAnimation();
  const {
    triggerAnimation: triggerBloodAnimation,
    removeAnimation: removeBloodAnimation,
  } = useSyncGameAnimation();
  const {
    triggerAnimation: triggerHealAnimation,
    removeAnimation: removeHealAnimation,
  } = useSyncGameAnimation();
  function clearAllAnimations() {
    removeBloodAnimation();
    removeHealAnimation();
  }
  useGameEventListener({
    type: "cardStartAttacking",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card && cardRef.current) {
        cardRef.current.style.display = "block";
        setIsShown(true);
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
        clearAllAnimations();
      }
    },
    filter: (e) => {
      const event = e as PlaceCardEvent;
      return (
        event.position === position && event.isPlayer === isPlayerCard
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
            setIsShown(false);
          }
        },
      });
    },
    filter: (e) => {
      const event = e as CardDestroyedEvent;
      return (
        event.initiator.isPlayerCard === isPlayerCard &&
        event.initiator.cardPosition === position
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
        computeStyle: flash(
          cardRef.current.querySelector<HTMLElement>(".cardDamage")
        ),
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
  useGameEventListener({
    type: "healCard",
    action: () => {
      if (!cardRef.current) {
        return;
      }
      triggerHealAnimation({
        replace: true,
        duration: 50,
        computeStyle: flash(
          cardRef.current.querySelector<HTMLElement>(".cardHeal")
        ),
      });
    },
    filter: (e) => {
      const event = e as HealCardEvent;
      return (
        event.cardPosition === position && event.isPlayerCard === isPlayerCard
      );
    },
  });

  function flash(element: HTMLElement | null) {
    return (
      animationTimeline(50)
        // y is the current translation y of the ref
        .add(
          element,
          {
            opacity: 0,
          },
          [
            { values: { opacity: 60 }, to: 20, ease: [0, 0.42, 1, 1] },
            { values: { opacity: 0 }, ease: [0, 0.42, 1, 1] },
          ]
        ).progress
    );
  }

  return (
    <div className={cn(isShown ? "block" : "hidden")} ref={cardRef}>
      <div className="cardHeal rounded-sm z-10 absolute top-0 w-full h-full bg-gradient-to-b  from-[#2105ad] via-[#4b429d] via-[37%] to-[#2105ad] opacity-0 origin-top" />
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

export function CardEffectsElements({
  isPlayerCard,
  position,
}: {
  isPlayerCard: boolean;
  position: number;
}) {
  const [states, setStates] = useState<CardState[]>([]);

  useGameEventListener({
    type: "placeCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card === null) {
        return;
      }
      setStates([...card.states]);
    },
    filter: (event) =>
      (event as PlaceCardEvent).isPlayer === isPlayerCard &&
      (event as PlaceCardEvent).position === position,
  });

  useGameEventListener({
    type: "addState",
    action: (event) => {
      setStates((states) => {
        const existingState = states.find(
          (s) => s.type === (event as AddStateEvent).state.type
        );
        if (existingState) {
          return states;
        }
        return [...states, (event as AddStateEvent).state];
      });
    },
    filter: (event) =>
      (event as AddStateEvent).isPlayerCard === isPlayerCard &&
      (event as AddStateEvent).position === position,
  });

  return (
    <div className="absolute right-[4px] top-[5px] flex flex-col gap-2">
      <div
        className="flex flex-col absolute"
        style={{ top: 0, right: inPx(6 * 0.8) }}
      >
        {states.map((state, index) => (
          <GameCardEffect
            state={state}
            isPlayerCard={isPlayerCard}
            position={position}
            removeState={(stateType) => {
              setStates((states) => states.filter((s) => s.type !== stateType));
            }}
            key={state.type}
            statePosition={index}
          />
        ))}
      </div>
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
            <GameCardHpBar position={position} isPlayerCard={isPlayerCard} />
          </InnerBord>
        </div>
        <CardEffectsElements isPlayerCard={isPlayerCard} position={position} />
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
  const scope = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();

  useGameEventListener({
    type: "placeCard",
    action: (_, state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (card === null) {
        return;
      }
      setHp(card.hp);
      const lifeBar = scope.current?.querySelector<HTMLElement>(".lifeBar");
      if (lifeBar) {
        lifeBar.style.transform = `scaleX(${card.hp / card.maxHp})`;
      }
    },
    filter: (event) =>
      (event as PlaceCardEvent).isPlayer === isPlayerCard &&
      (event as PlaceCardEvent).position === position,
  });

  useGameEventListener({
    type: "cardDamageResolve",
    action: (_, state) => onHpChange(state),
    filter: (event) =>
      (event as CardDamagResolveEvent).initiator.cardPosition === position &&
      (event as CardDamagResolveEvent).initiator.isPlayerCard === isPlayerCard,
  });

  useGameEventListener({
    type: "healCard",
    action: (_, state) => onHpChange(state),
    filter: (event) =>
      (event as HealCardEvent).isPlayerCard === isPlayerCard &&
      (event as HealCardEvent).cardPosition === position,
  });

  function onHpChange(state: GameStateObject) {
    const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
      position
    ];
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
        computeStyle: animationTimeline(50).add(
          hpBarRef.current,
          { scaleX: 1 },
          [
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
          ]
        ).progress,
      });
    }
  }

  return (
    <div ref={scope} className="shadow-md grid grid-cols-1 text-sm relative ">
      <EmptyBar>
        <div className="lifeBar w-full h-full absolute origin-left bg-gradient-to-b  from-[#0fad05] via-[#74cc6f] via-[37%] to-[#0fad05]" />
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
