import useGameStore, {
  GameStore,
  InGameCardType,
} from "@/game/stores/gameStateStore";
import { useGameAnimation } from "@/game/gameBehavior/animation/useGameSyncAnimation";
import { animationSteps } from "@/game/gameBehavior/animation/timeline";
import { GameCardDesign } from "./GameCard";

interface GameCardDeathProps {
  isPlayerCard: boolean;
  position: number;
}

export function getDeathAnimationKey(isPlayerCard: boolean, position: number) {
  return `death_${isPlayerCard}_${position}`;
}

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

  return (
    <div ref={cardAnimationRef} className="relative">
      <GameCardDesign card={card} size={2.5} />
    </div>
  );
}
