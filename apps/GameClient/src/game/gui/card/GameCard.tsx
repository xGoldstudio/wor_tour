import { useGameAnimation } from "@/game/gameBehavior/animation/useGameSyncAnimation";
import HpBar from "../HpBar";
import CardBorder, { CardContentIllustartion, InnerBord } from "../../../../../../packages/ui/card/CardBorder";
import { GameStore, InGameCardType } from "@/game/stores/gameStateStore";
import { FRAME_TIME } from "@/game/gameBehavior/useGameEvents";
import animationTimeline from "@/game/gameBehavior/animation/timeline";
import getImageEffects from "./utils/getImageEffects";
import { CardEffects } from "@repo/types";

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
    },
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
      ],
    )(elapsedFrames, requiredFrames);
  });

  return (
    <div
      ref={cardAnimationRef}
      style={{
        transform: `translateY(${isPlayerCard ? -15 : 15}px) scale(108%)`,
      }}
    >
      <GameCardDesign card={card} size={2.5}>
        <div
          ref={animationRef}
          className="absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top"
        />
      </GameCardDesign>
    </div>
  );
}

export function CardEffectsElements({ effects }: { effects: CardEffects }) {
  const effectToShow = getImageEffects(effects);

  return (
    <div className="absolute right-1 top-2 flex flex-col gap-2">
      {effectToShow.map((effectSrc) => (
        <div
          className="p-1 bg-slate-100 border-2 border-black rounded-full shadow-[0px_0px_5px_0px_#fca5a5]"
          key={effectSrc}
        >
          <img src={`/${effectSrc}`} width={16} height={16} />
        </div>
      ))}
    </div>
  );
}

export default GameCard;

interface GameCardDesign {
  card: InGameCardType;
  size: number;
  children?: React.ReactNode;
}

export function GameCardDesign({ card, size, children }: GameCardDesign) {
  return (
    <CardBorder rarity={card.rarity} size={size}>
      <div className="w-full h-full grid grid-rows-[auto_37px] gap-1">
        <div className="w-full h-full grow relative">
          <CardContentIllustartion card={card} size={size} />
          {children}
        </div>
        <div className="w-full h-min">
          <InnerBord size={size}>
            <HpBar hp={card.hp} maxHp={card.maxHp} />
          </InnerBord>
        </div>
        <CardEffectsElements effects={card.effects} />
      </div>
    </CardBorder>
  );
}
