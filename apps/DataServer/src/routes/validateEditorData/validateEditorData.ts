import { CardStat, CardState, CardStatesData, CardStatLevel, DeepPartial, defaultValue, EditorData, filterNulls, findInOrFirst, inRangeValue, isTrueOr, safeMap, WorldStats, CardStateShape } from "@repo/ui";

export function purifyAppState(data: Partial<EditorData>): EditorData {
	const safeCards: CardStat[] = safeMap<Partial<CardStat>, CardStat>(data.cards)(validateCard);
	const safeWorlds: WorldStats[] = safeMap<Partial<WorldStats>, WorldStats>(data.worlds)(validateWorld);
	return {
		cards: safeCards,
		worlds: safeWorlds,
	}
}

function validateCard(card: Partial<CardStat>, index: number): CardStat {
	const inRatioRange = (value: number | undefined) => inRangeValue(0.01, 0.99)(defaultValue(0.5)(value));
	return {
		name: card.name || `${card.rarity} card ${index}`,
		rarity: card.rarity || "common",
		id: index,
		world: card.world ?? 1,
		attackDefenseRatio: inRatioRange(card.attackDefenseRatio),
		speedDamageRatio: inRatioRange(card.speedDamageRatio),
		stats: validateCardStatsArray(card.stats),
	}
}

function validateCardStatsArray(stat?: Partial<CardStatLevel>[])
	: [CardStatLevel, CardStatLevel, CardStatLevel] {
	return [
		validateCardStat(stat?.[0]),
		validateCardStat(stat?.[1]),
		validateCardStat(stat?.[2]),
	];
}

function validateCardStat(stat?: Partial<CardStatLevel>): CardStatLevel {
	return stat
		? {
			cost: defaultValue(1)(stat.cost),
			states: validateStates(stat.states),
			illustration: stat.illustration || null,
		}
		: defaultCardStatLevel;
}

const defaultCardStatLevel: CardStatLevel = {
	cost: 1,
	states: [],
	illustration: null,
}

function validateStates(states?: DeepPartial<CardState>[]): CardState[] {
	return filterNulls(safeMap<DeepPartial<CardState>, (CardState | null)>(states)(validateState));
}

// make sure the state is valid (type exists, trigger exists, target exists, value is in range)
function validateState(state: Partial<CardState>): CardState | null {
	const type = state.type;
	if (!type) return null;
	const data = CardStatesData[type];
	const res: CardStateShape = {
		type,
		trigger: findInOrFirst(data.triggers)(state.trigger),
		target: findInOrFirst(data.targets)(state.target),
		value: isTrueOr(null, defaultValue(data.min ?? data.max ?? 0)(state.value))(data.noValue),
	}
	return res as CardState;
}

function validateWorld(world: Partial<WorldStats>, index: number): WorldStats {
	return {
		id: index + 1,
		illustration: world.illustration || null,
		cardBackground: world.cardBackground || null,
		name: world.name || `World ${index}`,
		description: world.description || `Description of world ${index}`,
	}
}