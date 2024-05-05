import findCard from "@/cards";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore, { InGameCard } from "@/stores/gameStateInterface";
import { useEffect } from "react";

export const manaSpeed = 5000;

interface GameEventsActions {
	userPlaceNewCard: (cardId: number) => void;
}

type GameEvents = "playerManaChange" | "opponentManaChange";
// all game logic here
function useGameEvents(): GameEventsActions {
	const { increaseMana, getData, placeCardBoard, consumeMana, startEarningMana } = useGameStore();
	const { getData: getUserInterfaceData } = useGameInterface();

	useEffect(() => {
		increaseManaTimer(true);
		increaseManaTimer(false);
	}, [])

	function increaseManaTimer(isPlayer: boolean) {
		startEarningMana(isPlayer);
		setTimeout(() => {
			increaseMana(isPlayer);
			triggerEvent(isPlayer ? "playerManaChange" : "opponentManaChange");
		}, manaSpeed)		
	}

	function triggerEvent(event: GameEvents) {
		const { playerMana, opponentMana, playerTimestampStartEarningMana, opponentTimestampStartEarningMana } = getData();
		if (event === "playerManaChange") {
			if (playerMana < 9 && playerTimestampStartEarningMana === null) {
				increaseManaTimer(true);
			}
		}
		if (event === "opponentManaChange") {
			if (opponentMana < 9 && opponentTimestampStartEarningMana === null) {
				increaseManaTimer(false);
			}
		}
	}

	function userPlaceNewCard(cardId: number) {
		const targetPosition = getUserInterfaceData().cardTarget;
		if (targetPosition === null) {
			return;
		}
		const foundCard = findCard(cardId);
		const cardInGame: InGameCard = {
			id: cardId,
			maxHp: foundCard.hp,
			hp: foundCard.hp,
			dmg: foundCard.dmg,
			attackSpeed: foundCard.attackSpeed,
		};
		consumeMana(true, foundCard.cost);
		triggerEvent("playerManaChange");
		placeCardBoard(true, targetPosition, cardInGame);
		// instanciate card
	}

	return {
		userPlaceNewCard,
	}
}

export default useGameEvents;