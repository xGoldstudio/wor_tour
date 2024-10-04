import useEditorStore from "@/editor/store/EditorStore";
import { CardType } from "game_engine";

const dummyCard: CardType = {
	name: "Dummy",
	cost: 9,
	illustration: "string",
	worldIllustration: "string",
	dmg: 0,
	hp: 200,
	attackSpeed: 0.5,
	states: [
		// healStateDefaultTest,
		// { ...massacreStateTest, value: 100 } as CardState,
		// { ...rageStateTest, value: 50 } as CardState,
	],
	level: 1,
	world: 1,
	rarity: "epic",
	id: 0,
	isPvp: false,
};

export function useDummyCard() {
	const cardIllustartion = useEditorStore(
		(state) => state.cards[44]?.stats[2].illustration
	);
	const worldIllustration = useEditorStore(
		(state) => state.worlds[1].cardBackground
	);
	dummyCard.illustration = cardIllustartion ?? "";
	dummyCard.worldIllustration = worldIllustration ?? "";
	return dummyCard;
}