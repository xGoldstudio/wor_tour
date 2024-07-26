import { initPlayerStore } from "./playerStore/defaultData";
import clientLoop from "../services/LoopService/clientLoop";
import { initShopStore } from "./shopStore/shopStore";
import { initRewardStore } from "./rewardStore";

export function _warningResetPlayStore() {
	console.log("All data has been initialized");
	clientLoop.reset();
	initPlayerStore();
	initShopStore();
	initRewardStore();
}