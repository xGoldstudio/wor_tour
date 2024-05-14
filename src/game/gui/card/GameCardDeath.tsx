import useGameStore, {
  GameStore,
  InGameCardType,
} from "@/stores/gameStateInterface";
import CardBorder from "./CardBorder";
import HpBar from "../HpBar";
import { CardEffects } from "@/cards";
import { effectsImages } from "./GameCard";
import { useGameAnimation } from "@/game/gameBehavior/animation/useGameSyncAnimation";
import { animationSteps } from "@/game/gameBehavior/animation/timeline";

interface GameCardDeathProps {
  isPlayerCard: boolean;
  position: number;
}

export function getDeathAnimationKey(isPlayerCard: boolean, position: number) {
  return `death_${isPlayerCard}_${position}`;
}

// todo require refactor
export default function GameCardDeath({
  isPlayerCard,
  position,
}: GameCardDeathProps) {
  const animation = useGameStore((state) =>
    state.animations.get(getDeathAnimationKey(isPlayerCard, position))
  );

  if (!animation) {
    return <></>;
  }

  return (
    <GameCardDeathAnimated
      card={animation.data.card}
      startTick={animation.onTick}
      animationDuration={animation.animationDuration}
    />
  );
}

function GameCardDeathAnimated({
  card,
  startTick,
  animationDuration,
}: {
  card: InGameCardType;
  startTick: number;
  animationDuration: number;
}) {
  const cardAnimationRef = useGameAnimation<
    GameStore & { currentTick: number }
  >((state) => {
    const elapsedFrames = state.currentTick - startTick;
		return animationSteps(
			{
				opacity: [100, 25, 0],
				x: [0, 15, -15, 15, 0],
			},
			{
				ease: [0, 1, 1, 1],
				duration: animationDuration,
			}
		)(elapsedFrames);
  });

  const effectToShow = [];
  for (const effect in card.effects) {
    const existingImage = effectsImages[effect as keyof CardEffects["effects"]];
    existingImage &&
      card.effects[effect as keyof CardEffects["effects"]] &&
      effectToShow.push(existingImage);
  }

  return (
    <div ref={cardAnimationRef} className="relative">
      <CardBorder rarity={card.rarity} size={2.5}>
        <div className="w-full h-full flex flex-col">
          <div
            className="w-full grow relative"
            style={{
              backgroundImage: `url(/${card.id}.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="absolute right-1 top-2 flex flex-col gap-2">
            {effectToShow.map((effectSrc) => (
              <div className="p-[4px] bg-slate-100 border-[1px] border-orange-400 rounded-full">
                <img src={`/${effectSrc}`} width={16} height={16} />
              </div>
            ))}
          </div>
          <HpBar hp={card.hp} maxHp={card.maxHp} />
        </div>
      </CardBorder>
    </div>
  );
}
