import { InGameCardType } from "game_engine";
import { CardBorder, CardContentIllustartion, InnerBord } from "../../CardBorder";
import GameCardHpBar from "../gameCardHpBar/GameCardHpBar";
import CardEffectsElements from "../gameCardEffects/GameCardEffects";

interface GameCardDesign {
  size: number;
  children?: React.ReactNode;
  position: number;
  isPlayerCard: boolean;
  card: InGameCardType;
  trackedInstanceId: React.MutableRefObject<number | null>;
}

export default function GameCardDesign({
  size,
  card,
  position,
  isPlayerCard,
  children,
  trackedInstanceId,
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
              trackedInstanceId={trackedInstanceId}
            />
          </InnerBord>
        </div>
        <CardEffectsElements
          isPlayerCard={isPlayerCard}
          position={position}
          trackedInstanceId={trackedInstanceId}
        />
      </div>
    </CardBorder>
  );
}
