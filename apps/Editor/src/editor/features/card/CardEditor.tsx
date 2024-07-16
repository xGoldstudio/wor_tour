import { range } from "lodash";
import Ratios from "../../ui/Ratios";
import useEditorStore from "../../store/EditorStore";
import { useNavigate, useParams } from "react-router";
import {
  CardStat,
  CardState,
  CardStatLevel,
  StateCardState as TypeCardState,
  TargetCardState,
  TriggerCardState,
} from "@repo/types";
import ImageManager from "@/editor/utils/ImageManager";
import {
  arrayfindElementOrFirst,
  Button,
  CardType,
  FullCard,
  cn,
  getRealStrength,
  getStats,
  getTargetStrength,
  getValueInRange,
  testIsStrengthValid,
  CardStatesData,
} from "@repo/ui";
import { DeleteIcon, PlusCircle } from "lucide-react";

export default function CardEditor() {
  const { cardId: cardIdParam } = useParams();
  const navigate = useNavigate();

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
    return (cardLevel: Partial<CardStatLevel>) => {
      if (!card) return;
      setCard({
        ...card,
        stats: card.stats.map((s, i) =>
          i === level - 1 ? { ...s, ...cardLevel } : s
        ) as [CardStatLevel, CardStatLevel, CardStatLevel],
      });
    };
  }

  return (
    <div className="flex w-full items-center flex-col pt-4 gap-2">
      <div className="flex gap-2">
        <select
          value={card.id}
          onChange={(v) => {
            navigate(`../worlds/${card.world}/${v.target.value}`);
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
      <div className="py-8">
        <Ratios setCard={setCard} card={card} />
      </div>

      <div className="flex gap-8">
        <CardLevel cardStats={card} setCardStats={setCardLevel(1)} level={1} />
        <CardLevel cardStats={card} setCardStats={setCardLevel(2)} level={2} />
        <CardLevel cardStats={card} setCardStats={setCardLevel(3)} level={3} />
      </div>
    </div>
  );
}

interface CardLevelProps {
  cardStats: CardStat;
  setCardStats: (card: Partial<CardStatLevel>) => void;
  level: number;
}

function cardStatsToCard(cardStats: CardStat, level: number): CardType {
  const levelStat = cardStats.stats[level - 1];
  const stats = getStats(cardStats, level);
  const world = useEditorStore.getState().getWorld(cardStats.world);

  return {
    name: cardStats.name,
    cost: levelStat.cost,
    illustration: levelStat.illustration || "",
    worldIllustration: world?.cardBackground || "",
    dmg: stats.dmg,
    hp: stats.hp,
    attackSpeed: stats.attackSpeed,
    rarity: cardStats.rarity,
    id: cardStats.id,
    effects: levelStat.effects,
    level,
    world: cardStats.world,
    states: levelStat.states,
  };
}

function CardLevel({ cardStats, setCardStats, level }: CardLevelProps) {
  const card = cardStatsToCard(cardStats, level);
  const cardStat = cardStats.stats[level - 1];

  const realStrength = getRealStrength(card);
  const targetStrength = getTargetStrength(card);
  const isStrengthValid = testIsStrengthValid(realStrength, targetStrength);

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
            {realStrength}
          </span>{" "}
          / <span className="text-blue-500">{targetStrength}</span>
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
          <EffectFields
            key={`${i}_${state.type}`}
            deleteState={() => {
              setCardStats({
                states: [...cardStat.states.filter((_, j) => i !== j)],
              });
            }}
            card={card}
            state={state}
            changeState={(newState) => {
              setCardStats({
                states: [
                  ...cardStat.states.map((s, j) => {
                    if (i === j) {
                      const type = newState.type || s.type;
                      const typeRestrictions = CardStatesData[type];

                      const computeValue = () => {
                        if (typeRestrictions.noValue) return null;
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
                        ...s,
                        ...newState,
                        trigger: arrayfindElementOrFirst<TriggerCardState>(
                          newState.trigger || s.trigger,
                          typeRestrictions.triggers
                        ),
                        target: arrayfindElementOrFirst(
                          newState.target || s.target,
                          typeRestrictions.targets
                        ),
                        value: computeValue(),
                      };
                      console.log("next", next);
                      return next;
                    }
                    return s;
                  }),
                ],
              });
            }}
          />
        ))}
      </div>
      <FullCard card={card} className="pt-8" size={0.9} />
    </div>
  );
}

function EffectFields({
  deleteState,
  changeState,
  state,
  card,
}: {
  deleteState: () => void;
  changeState: (newState: Partial<CardState>) => void;
  state: CardState;
  card: CardType;
}) {
  const stateRestriction = CardStatesData[state.type];
  return (
    <div className="w-full col-span-2 flex gap-2">
      <div className="h-full flex items-center">({stateRestriction.computeCost({
        dmg: card.dmg,
        dps: card.dmg * card.attackSpeed,
        hp: card.hp,
        trigger: state.trigger,
        target: state.target,
        value: state.value
      }).toFixed(2)})</div>
      <div className="w-full col-span-2 grid grid-cols-4 gap-2">
        <select
          value={state.type}
          onChange={(v) => {
            changeState({ type: v.target.value as TypeCardState });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={state.target}
          onChange={(v) => {
            changeState({ target: v.target.value as TargetCardState });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {targets
            .filter((target) =>
              stateRestriction.targets.find((t) => t === target)
            )
            .map((target) => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
        </select>
        <select
          value={state.trigger}
          onChange={(v) => {
            changeState({ trigger: v.target.value as TriggerCardState });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {triggers
            .filter((trigger) =>
              stateRestriction.triggers.find((t) => t === trigger)
            )
            .map((trigger) => (
              <option key={trigger} value={trigger}>
                {trigger}
              </option>
            ))}
        </select>
        <input
          type="number"
          value={state.value?.toString()}
          onChange={(v) => changeState({ value: parseInt(v.target.value) })}
          className="border-2 border-black p-2 rounded-md"
          disabled={stateRestriction.noValue}
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


const states = ["heal", "riposte", "multiAttack"];
const targets = [
  "selfCard",
  "directEnnemyCard",
  "enemyCards",
  "allyCards",
  "allCards",
  "player",
  "opponent",
  "notSpecified",
]; // not specified mean the effect select his target himself
const triggers = [
  "idle",
  "onAttack",
  "onDamage",
  "onPlacement",
  "onDeath",
  "onHeal",
  "onKill",
];
