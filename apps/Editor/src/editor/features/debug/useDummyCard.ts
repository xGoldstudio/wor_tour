import useEditorStore from "@/editor/store/EditorStore";
import { CardState, CardType } from "@repo/lib";
import { healStateDefaultTest, massacreStateTest, rageStateTest } from "game_engine";

const dummyCard: CardType = {
	name: "Dummy",
	cost: 1,
	illustration: "string",
	worldIllustration: "string",
	dmg: 0,
	hp: 200,
	attackSpeed: 0.5,
	states: [healStateDefaultTest, { ...massacreStateTest, value: 100 } as CardState,
		{ ...rageStateTest, value: 50 } as CardState,
	],
	level: 1,
	world: 1,
	rarity: "common",
	id: 0,
};

export function useDummyCard() {
	const cardIllustartion = useEditorStore(
		(state) => state.cards[21]?.stats[2].illustration
	);
	const worldIllustration = useEditorStore(
		(state) => state.worlds[1].cardBackground
	);
	dummyCard.illustration = cardIllustartion ?? "";
	dummyCard.worldIllustration = worldIllustration ?? "";
	return dummyCard;
}