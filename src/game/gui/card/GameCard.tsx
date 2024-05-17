import { useGameAnimation } from "@/game/gameBehavior/animation/useGameSyncAnimation";
import HpBar from "../HpBar";
import CardBorder from "./CardBorder";
import { GameStore, InGameCardType } from "@/stores/gameStateInterface";
import { FRAME_TIME } from "@/game/gameBehavior/useGameEvents";
import { CardEffects } from "@/cards";
import animationTimeline from "@/game/gameBehavior/animation/timeline";

export const effectsImages: Partial<
  Record<keyof CardEffects["effects"], string>
> = {
  fightBack: "fightback.svg",
  multiAttack: "multiAttack.svg",
};

function GameCard({
  card,
  isPlayerCard,
  position,
}: {
  card: InGameCardType;
  isPlayerCard: boolean;
  position: number;
}) {
  const animationRef = useGameAnimation<GameStore & { currentTick: number }>(
    (state) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (typeof card?.startAttackingTick !== "number") {
        return {
          transform: `scaleY(100%)`,
        };
      }
      const attackProgress =
        (state.currentTick - card.startAttackingTick) /
        (1000 / card.attackSpeed / FRAME_TIME);
      return {
        transform: `scaleY(${100 - attackProgress * 100}%)`,
      };
    }
  );
  const cardAnimationRef = useGameAnimation<
    GameStore & { currentTick: number }
  >((state) => {
    const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
      position
    ];
    if (!card?.startAttackingTick) {
      return {
        transform: "",
      };
    }

    const elapsedFrames = state.currentTick - card.startAttackingTick;
    const requiredFrames = 1000 / card.attackSpeed / FRAME_TIME;

    return animationTimeline(
      {
        scale: 108,
        y: isPlayerCard ? -15 : 15,
      },
      [
        {
          from: 0,
          to: 15,
          ease: [0, 0.42, 1, 1],
          values: { scale: 100, y: 0 },
        },
        {
          from: -35,
          to: -5,
          ease: [0, 1, 1, 1],
          values: { scale: 108, y: isPlayerCard ? 15 : -15 },
        },
        {
          from: -5,
          to: 0,
          ease: [0, 0.42, 1, 1],
          values: { scale: 108, y: isPlayerCard ? -15 : 15 },
        },
      ]
    )(elapsedFrames, requiredFrames);
  });

  return (
    <div
      ref={cardAnimationRef}
      style={{
        transform: `translateY(${isPlayerCard ? -15 : 15}px) scale(108%)`,
      }}
    >
      <CardBorder rarity={card.rarity} size={2.5}>
        <div className="w-full h-full flex flex-col">
          <div
            className="w-full grow relative"
            style={{
              backgroundImage: `url(/${card.id}.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              ref={animationRef}
              className="absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top"
            />
          </div>
          <HpBar hp={card.hp} maxHp={card.maxHp} />
          <CardEffectsElements effects={card.effects} />
        </div>
      </CardBorder>
    </div>
  );
}

export function CardEffectsElements({ effects }: { effects: CardEffects }) {
  const effectToShow = getImageEffects(effects);

  return (
    <div className="absolute right-1 top-2 flex flex-col gap-2">
      {effectToShow.map((effectSrc) => (
        <div
          className="p-[4px] bg-slate-100 border-[1px] border-orange-400 rounded-full"
          key={effectSrc}
        >
          <img src={`/${effectSrc}`} width={16} height={16} />
        </div>
      ))}
    </div>
  );
}

export function getImageEffects(effects: CardEffects) {
  const effectToShow = [];

  for (const effect in effects) {
    const existingImage = effectsImages[effect as keyof CardEffects];
    existingImage &&
      effects[effect as keyof CardEffects] &&
      effectToShow.push(existingImage);
  }

  return effectToShow;
}

export default GameCard;
