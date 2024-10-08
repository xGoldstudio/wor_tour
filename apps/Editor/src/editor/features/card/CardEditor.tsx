import { range } from "lodash";
import Ratios from "../../ui/Ratios";
import useEditorStore from "../../store/EditorStore";
import { useNavigate, useParams } from "react-router";
import ImageManager from "@/editor/utils/ImageManager";
import { Button, FullCard, cn } from "@repo/ui";
import { arrayfindElementOrFirst, getValueInRange } from "@repo/lib";
import { DeleteIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  getStats,
  CardType,
  getRealStrength,
  getTargetStrength,
  testIsStrengthValid,
  CardStatesData,
  getOptionsFromType,
  CardState,
  CardStatsInfoLevel,
  CardStatLevel,
  CardStat,
  TriggersOf,
  TargetsOf,
  ValueOf,
  getStatsStrength,
  cardCostMultiplier,
  CardStateInfo,
  getAbsoluteTargetStrength,
} from "game_engine";

export default function CardEditor() {
  const { cardId: cardIdParam } = useParams();
  const navigate = useNavigate();
  const [isPvp, setIsPvp] = useState(false);

  const cardId = cardIdParam ? parseInt(cardIdParam) : undefined;

  const { card, updateCard, cards } = useEditorStore((state) => ({
    card: cardId ? state.getCard(cardId) : undefined,
    updateCard: state.updateCard,
    cards: state.cards,
  }));

  if (!card || !cardId) {
    return <div>Card not found</div>;
  }

  const setCard = updateCard(cardId);

  function setCardLevel(level: number) {
    return (cardLevel: Partial<CardStatsInfoLevel>) => {
      if (!card) return;
      setCard({
        ...card,
        stats: card.stats.map((s, i) =>
          i === level - 1 ? { ...s, ...cardLevel } : s
        ) as [CardStatLevel, CardStatLevel, CardStatLevel],
      });
    };
  }

  function adjustementStrengthChange(delta: number) {
    if (!card) return;
    setCard({
      adjustementStrength: card.adjustementStrength + delta,
    });
  }

  return (
    <div className="flex w-full items-center flex-col pt-4 gap-2">
      <div className="flex gap-2">
        <select
          value={card.id}
          onChange={(v) => {
            navigate(`../${card.world}/${v.target.value}`);
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.id} - {card.name}
            </option>
          ))}
        </select>
        <input
          value={card.name}
          className="border-2 border-black p-2 rounded-md"
          onChange={(v) => {
            setCard({ ...card, name: v.target.value });
          }}
        />
      </div>
      <div className="flex gap-2">
        <p>Is pvp:</p>
        <input
          type="checkbox"
          checked={isPvp}
          onChange={(v) => setIsPvp(v.target.checked)}
        />
      </div>
      <div className="py-8 flex gap-8 items-center">
        <Ratios setCard={setCard} card={card} />
        <div className="flex gap-4 flex-col items-center">
          <p>Strength Adjustement</p>
          <div className="flex gap-4 items-center">
            <Button action={() => adjustementStrengthChange(-10)} small>
              -10
            </Button>
            <Button action={() => adjustementStrengthChange(-1)} small>
              -1
            </Button>
            <p>{card.adjustementStrength}%</p>
            <Button action={() => adjustementStrengthChange(+1)} small>
              +1
            </Button>
            <Button action={() => adjustementStrengthChange(+10)} small>
              +10
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <CardLevel
          cardStats={card}
          setCardStats={setCardLevel(1)}
          level={1}
          isPvp={isPvp}
        />
        <CardLevel
          cardStats={card}
          setCardStats={setCardLevel(2)}
          level={2}
          isPvp={isPvp}
        />
        <CardLevel
          cardStats={card}
          setCardStats={setCardLevel(3)}
          level={3}
          isPvp={isPvp}
        />
      </div>
    </div>
  );
}

interface CardLevelProps {
  cardStats: CardStat;
  setCardStats: (card: Partial<CardStatLevel>) => void;
  level: number;
  isPvp: boolean;
}

function cardStatsToCard(
  cardStats: CardStat,
  level: number,
  isPvp: boolean
): CardType {
  const stats = getStats(cardStats, level, isPvp);
  const world = useEditorStore.getState().getWorld(cardStats.world);

  return {
    name: cardStats.name,
    cost: stats.cost,
    illustration: stats.illustration || "",
    worldIllustration: world?.cardBackground || "",
    dmg: stats.dmg,
    hp: stats.hp,
    attackSpeed: stats.attackSpeed,
    rarity: cardStats.rarity,
    id: cardStats.id,
    level,
    world: cardStats.world,
    states: stats.states,
    isPvp: stats.isPvp,
  };
}

function CardLevel({ cardStats, setCardStats, level, isPvp }: CardLevelProps) {
  const card = cardStatsToCard(cardStats, level, isPvp);
  const cardStat = cardStats.stats[level - 1];

  const realStrength = getRealStrength(card, isPvp);
  const targetStrength = getTargetStrength(card, isPvp);
  const adjustedStrength =
    (targetStrength * (100 + cardStats.adjustementStrength)) / 100;
  const isStrengthValid = testIsStrengthValid(realStrength, adjustedStrength);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[500px]  bg-slate-200 p-2 rounded-md grid grid-cols-[1fr_2fr] gap-y-2">
        <h2 className="col-span-2 text-center pt-1 text-xl font-bold">
          Level {level}
        </h2>
        <p className="col-span-2 text-center">
          <span
            className={cn(isStrengthValid ? "text-green-500" : "text-red-500")}
          >
            {realStrength.toFixed(2)}
          </span>{" "}
          /{" "}
          <span className="text-blue-500">
            {adjustedStrength.toFixed(2)}({targetStrength}+
            {(adjustedStrength - targetStrength).toFixed(2)})
          </span>
        </p>
        <label>Illustration: </label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={async (v) => {
            setCardStats({
              illustration: await ImageManager().addImage(
                v.target.files![0],
                `card_${card.id}_level_${level}`
              ),
            });
          }}
        />
        <label>Cost: </label>
        <select
          value={card.cost}
          onChange={(v) => {
            setCardStats({ cost: parseInt(v.target.value) });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {range(1, 10).map((cost) => (
            <option key={cost} value={cost}>
              {cost} mana
            </option>
          ))}
        </select>
        <p>Stat cost:</p>
        <p>{getStatsStrength(card) / cardCostMultiplier ** (card.cost - 1)}</p>
        <p className="w-full text-center col-span-2 text-xl font-semibold pt-2">
          Effects
        </p>
        <div className="w-full col-span-2 flex justify-center">
          <Button
            action={() => {
              setCardStats({
                states: [
                  ...cardStat.states,
                  {
                    type: "heal",
                    trigger: "onPlacement",
                    target: "allyCards",
                    value: 0,
                    costPercentage: 0,
                  },
                ],
              });
            }}
            small
          >
            <PlusCircle size={20} className="mr-2" /> Add effect
          </Button>
        </div>
        {cardStat.states.map((state, i) => (
          <StateFields
            isPvp={isPvp}
            key={`${i}_${state.type}`}
            deleteState={() => {
              setCardStats({
                states: [...cardStat.states.filter((_, j) => i !== j)],
              });
            }}
            card={card}
            realState={card.states[i]}
            state={state}
            changeState={(newState) => {
              setCardStats({
                states: [
                  ...cardStat.states.map((s, j): CardStateInfo => {
                    if (i === j) {
                      const type = (newState.type || s.type) as "heal"; // just the same value to make typescript happy (can be something else)
                      const typeRestrictions = CardStatesData[type];
                      const options = getOptionsFromType(type);

                      const computeValue = () => {
                        if (
                          typeRestrictions.noValue ||
                          !!options.computeValueFromCost
                        )
                          return null;
                        return getValueInRange(
                          typeRestrictions.min,
                          typeRestrictions.max
                        )(
                          newState.value !== undefined
                            ? newState.value
                            : s.value
                        );
                      };

                      const next = {
                        type,
                        trigger: arrayfindElementOrFirst<TriggersOf<"heal">>(
                          (newState.trigger || s.trigger) as TriggersOf<"heal">,
                          typeRestrictions.triggers as TriggersOf<"heal">[]
                        ),
                        target: arrayfindElementOrFirst<TargetsOf<"heal">>(
                          (newState.target || s.target) as TargetsOf<"heal">,
                          typeRestrictions.targets as TargetsOf<"heal">[]
                        ),
                        value: computeValue() as ValueOf<"heal">,
                        costPercentage: newState.costPercentage || null,
                      };
                      console.log("next", next);
                      return next as CardStateInfo;
                    }
                    return s;
                  }),
                ],
              });
            }}
          />
        ))}
      </div>
      <FullCard card={card} className="pt-8" size={0.9} showEffectDesc />
    </div>
  );
}

function StateFields({
  deleteState,
  changeState,
  state,
  card,
  realState,
  isPvp,
}: {
  deleteState: () => void;
  changeState: (newState: Partial<CardStateInfo>) => void;
  state: CardStateInfo;
  realState: CardState;
  card: CardType;
  isPvp: boolean;
}) {
  const stateRestriction = CardStatesData[state.type];
  const options = getOptionsFromType(state.type);

  return (
    <div className="w-full col-span-2 flex gap-2">
      <div className="h-full flex items-center">
        (
        {(
          stateRestriction.computeCost({
            dmg: card.dmg,
            dps: card.dmg * card.attackSpeed,
            hp: card.hp,
            trigger: realState.trigger,
            target: realState.target,
            value: realState.value,
            attackSpeed: card.attackSpeed,
            targetCost: getAbsoluteTargetStrength(card, isPvp),
            statCost: getStatsStrength(card),
            manaCost: card.cost,
          }) /
          cardCostMultiplier ** (card.cost - 1)
        ).toFixed(2)}
        )
      </div>
      <div className="w-full col-span-2 grid grid-cols-5 gap-2">
        <select
          value={state.type}
          onChange={(v) => {
            changeState({ type: v.target.value as CardState["type"] });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {Object.keys(CardStatesData).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={state.target}
          onChange={(v) => {
            changeState({ target: v.target.value as CardState["target"] });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {stateRestriction.targets.map((target) => (
            <option key={target} value={target}>
              {target}
            </option>
          ))}
        </select>
        <select
          value={state.trigger}
          onChange={(v) => {
            changeState({ trigger: v.target.value as CardState["trigger"] });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {stateRestriction.triggers.map((trigger) => (
            <option key={trigger} value={trigger}>
              {trigger}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={state.value?.toString()}
          onChange={(v) => {
            if (options.computeValueFromCost) {
              changeState({ value: parseInt(v.target.value) });
            } else {
              changeState({ value: parseInt(v.target.value) });
            }
          }}
          className="border-2 border-black p-2 rounded-md"
          disabled={stateRestriction.noValue || !!options.computeValueFromCost}
          min={stateRestriction.min}
          max={stateRestriction.max}
        />
        <input
          type="number"
          value={state.costPercentage?.toString()}
          onChange={(v) => {
            changeState({ costPercentage: parseInt(v.target.value) });
          }}
          className="border-2 border-black p-2 rounded-md"
          disabled={stateRestriction.noValue || !options.computeValueFromCost}
          min={stateRestriction.min}
          max={stateRestriction.max}
        />
      </div>
      <Button small action={deleteState}>
        <DeleteIcon />
      </Button>
    </div>
  );
}
