import useDataStore from "@/cards/DataStore";
import buildDeck, { getDeckStrength } from "./buildDeck";
import { findCard } from "@/cards";
import { CardType, getTargetStrength } from "game_engine";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import useGameMetadataStore, { GameReward } from "@/game/stores/gameMetadataStore";
import { Tier } from "@/home/store/tiers";
import { GameStateObject } from "game_engine";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { dailyGoldService, experienceService, keysService } from "../inject";
import useRewardStore from "@/home/store/rewardStore";

const MAX_TROPHIES_WIN = 35;
const LOWEST_TROPHIES_WIN = 25;

interface LoserQueue {
	strength: number;
	gameRemainings: number;
	trophiesPerWin: number;
}

// Need to be tested efficiently
export function MatchmakingService() {
	const store = create(persist(() => (
		{
			loserQueue: null as LoserQueue | null,
			isMirror: false,
		}
	), { name: "MatchmakingServiceStore" }));

	function startGame() {
		const deck = usePlayerStore.getState().deck;
		const setInGameData = useGameMetadataStore.getState().setInGameData;

		const isPvp = useDataStore.getState().isPvp;
		const isMirror = store.getState().isMirror;

		const playerDeck: CardType[] = deck.map((cardId) => findCard(cardId, usePlayerStore.getState().getCollectionInfo(cardId)!.level));
		const cardPool = getCardsPoolFromTier(usePlayerStore.getState().getCurrentTier());
		const { targetStrength, winTrophies, loseTrophies } = getTargetStrengthForGame();
		const opponentDeck = isMirror ? playerDeck : buildDeck(isPvp ? 80 : targetStrength, 0.2, cardPool);
		setInGameData(
			playerDeck, opponentDeck, getHpFromDeck(playerDeck), getHpFromDeck(opponentDeck),
			{
				player: {
					money: dailyGoldService.getGoldWinReward(),
					trophies: winTrophies,
				},
				opponent: {
					money: dailyGoldService.getGoldLoseReward(),
					trophies: loseTrophies,
				},
				draw: {
					money: dailyGoldService.getGoldLoseReward(),
					trophies: 0,
				}
			},
		);
	}

	function getTargetStrengthForGame() {
		const loserQueue = store.getState().loserQueue;
		if (loserQueue !== null) {
			return {
				targetStrength: loserQueue.strength,
				winTrophies: loserQueue.trophiesPerWin,
				loseTrophies: -loserQueue.trophiesPerWin,
			};
		}
		const targetStrength = usePlayerStore.getState().getCurrentTier().level.strength;
		const previousTierStrength = usePlayerStore.getState().getPreviousTier().level.strength;
		const randomValueBetween = Math.random() * (targetStrength - previousTierStrength) + previousTierStrength;

		const maxGap = targetStrength - previousTierStrength;
		const currentGap = targetStrength - randomValueBetween;
		const trophiesGap = Math.round((currentGap / maxGap) * (MAX_TROPHIES_WIN - LOWEST_TROPHIES_WIN));
		const winTrophies = MAX_TROPHIES_WIN - trophiesGap;
		const loseTrophies = Math.max(-(LOWEST_TROPHIES_WIN + trophiesGap), -usePlayerStore.getState().trophies);
		return { targetStrength: randomValueBetween, winTrophies, loseTrophies };
	}

	const MINIMAL_LOSER_QUEUE_TIER = 1;

	function endGame(gameState: GameStateObject) {
		const isWin = gameState.currentWinner === "player";
		const isLose = gameState.currentWinner === "opponent";
		const reward = useGameMetadataStore.getState().getReward(gameState.currentWinner);
		if (isWin) {
			keysService.consumeKey(usePlayerStore.getState().currentWorld);
			experienceService.gainExperience();
		}
		collectRewards(reward);
		const loserQueue = store.getState().loserQueue;
		if (usePlayerStore.getState().currentTier <= MINIMAL_LOSER_QUEUE_TIER) {
			store.setState({ loserQueue: null });
		}
		else if (isLose) {
			store.setState({
				loserQueue: {
					strength: getStrengthForLoserQueue((useGameMetadataStore.getState().playerCards)),
					gameRemainings: 2,
					trophiesPerWin: loserQueue?.trophiesPerWin ?? -Math.floor(reward.trophies / 2),
				}
			});
		} else if (isWin && loserQueue !== null) {
			loserQueue.gameRemainings -= 1;
			if (loserQueue.gameRemainings === 0) {
				store.setState({ loserQueue: null });
			}
		}
	}

	const LOSER_QUEUE_REDUCE_STRENGTH = 0.5;
	const MAX_LOSER_QUEUE_STRENGTH_REDUCED = 1.5;

	function getStrengthForLoserQueue(losingDeck: CardType[]): number {
		const loserQueue = store.getState().loserQueue;
		const referenceStrength = loserQueue
			? loserQueue.strength - LOSER_QUEUE_REDUCE_STRENGTH
			: getDeckStrength(losingDeck);

		const tierStrength = usePlayerStore.getState().getCurrentTier().level.strength;
		const targetStrength = (referenceStrength > tierStrength)
			? tierStrength - LOSER_QUEUE_REDUCE_STRENGTH
			: referenceStrength;
		return Math.max(targetStrength, tierStrength - MAX_LOSER_QUEUE_STRENGTH_REDUCED);
	}

	function collectRewards(rewards: GameReward) {
		// usePlayerStore.getState().addGold(rewards.money);
		dailyGoldService.earnReward(rewards.money);
		if (rewards.money > 0) {
			useRewardStore.getState().addReward({ type: "rawGold", amount: rewards.money });
		}
		if (rewards.trophies > 0) {
			useRewardStore.getState().addReward({ type: "rawTrophies", amount: rewards.trophies });
		}
	}

	function reset() {
		store.setState({ loserQueue: null });
	}

	function wathcIsMirror() {
		return store((state) => state.isMirror);
	}

	function toggleMirror() {
		store.setState({ isMirror: !store.getState().isMirror });
	}

	return { startGame, endGame, reset, wathcIsMirror, toggleMirror };
}

function getHpFromDeck(deck: CardType[]) {
	return Math.round(getDeckStrength(deck) * 100);
}

function getCardsPoolFromTier(tier: Tier) {
	const pool: [number, CardType][] = [];
	useDataStore.getState().cards.forEach(card => {
		if (card.world > tier.world) return;
		for (let i = 0; i < 3; i++) {
			const cardType = findCard(card.id, i + 1);
			pool.push([getTargetStrength(cardType, cardType.isPvp), cardType]);
		}
	});
	return pool.sort((a, b) => a[0] - b[0]);
}