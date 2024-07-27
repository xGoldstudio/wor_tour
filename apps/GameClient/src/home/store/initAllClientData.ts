import { initPlayerStore } from "./playerStore/defaultData";
import clientLoop from "../services/LoopService/clientLoopService";
import { initShopStore } from "./shopStore/shopStore";
import { initRewardStore } from "./rewardStore";

export function _warningResetPlayStore() {
	console.log("All data has been initialized");
	initPlayerStore();
	initShopStore();
	initRewardStore();
	clientLoop.reset(); // This is the function that resets the clientLoop and trigger cycle once
}