import { initPlayerStore } from "./playerStore/defaultData";
import { initShopStore } from "./shopStore/shopStore";
import { initRewardStore } from "./rewardStore";
import { clientLoop, dailyGoldService, keysService, matchmakingService } from "@/services/inject";

export function _warningResetPlayStore() {
	console.log("All data has been initialized");
	initPlayerStore();
	initShopStore();
	initRewardStore();
	dailyGoldService.reset();
	matchmakingService.reset();
	keysService.reset();
	clientLoop.reset(); // This is the function that resets the clientLoop and trigger cycle once
}