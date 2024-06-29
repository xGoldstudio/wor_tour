import HpBar from "../HpBar";
import CardBorder, {
  CardContentIllustartion,
  InnerBord,
} from "../../../../../../packages/ui/components/card/CardBorder";
import useGameStore, { InGameCardType } from "@/game/stores/gameStateStore";
import { CardEffects } from "@repo/types";
import { getImageEffects } from "@repo/ui";
import { GameStateObject } from "@/game/gameBehavior/gameEngine/gameState";
import { useGameAnimation } from "@/game/gameBehavior/animation/useGameSyncAnimation";
import animationTimeline from "@/game/gameBehavior/animation/timeline";
import { FRAME_TIME } from "@/game/gameBehavior/useGameEvents";

function GameCard({
  isPlayerCard,
  position,
  card,
}: {
  isPlayerCard: boolean;
  position: number;
  card: InGameCardType;
}) {
  const animationRef = useGameAnimation<GameStateObject>({
    tl: (ref) =>
      animationTimeline(1000 / (card.attackSpeed ?? 1) / FRAME_TIME)
        .add(`#animationProgress_${card.instanceId}`, { scaleY: 1 }, { values: { scaleY: 0 } })
        .add(ref, { scale: 1.08, y: isPlayerCard ? -15 : 15 }, [
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
        ]),
    getProgress: (state, currentTick) => {
      const card = (isPlayerCard ? state.playerBoard : state.opponentBoard)[
        position
      ];
      if (typeof card?.startAttackingTick !== "number") {
        return -1;
      }
      return currentTick - card.startAttackingTick;
    },
    deps: [card],
  });

  if (!card) {
    return null;
  }

  return (
    <div
      ref={animationRef}
      style={{
        transform: `translateY(${isPlayerCard ? -15 : 15}px) scale(108%)`,
      }}
    >
      <GameCardDesign card={card} size={2.5} isPlayerCard={isPlayerCard} position={position}>
        <div className="absolute top-0 w-full h-full bg-slate-600 opacity-40 origin-top" id={`animationProgress_${card.instanceId}`} />
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
  size: number;
  children?: React.ReactNode;
  position: number;
  isPlayerCard: boolean;
  card: InGameCardType;
}

export function GameCardDesign({ size, card, position, isPlayerCard, children }: GameCardDesign) {

  return (
    <CardBorder rarity={card.rarity} size={size}>
      <div className="w-full h-full grid grid-rows-[auto_37px] gap-1">
        <div className="w-full h-full grow relative">
          <CardContentIllustartion card={card} size={size} />
          {children}
        </div>
        <div className="w-full h-min">
          <InnerBord size={size}>
            <GameCardHpBar position={position} isPlayerCard={isPlayerCard} maxHp={card.hp} />
          </InnerBord>
        </div>
        <CardEffectsElements effects={card.effects} />
      </div>
    </CardBorder>
  );
}

function GameCardHpBar({position, isPlayerCard, maxHp}: {
  position: number;
  isPlayerCard: boolean;
  maxHp: number;
}) {
  const hp = useGameStore((s) => isPlayerCard ? s.state.playerBoard[position]?.hp : s.state.opponentBoard[position]?.hp);

  return (
    <HpBar hp={hp ?? maxHp} maxHp={maxHp} />
  )
}
