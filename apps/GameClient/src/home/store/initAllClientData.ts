import { initPlayerStore } from "./playerStore/defaultData";
import clientLoop from "../services/LoopService/clientLoop";
import { initShopStore } from "./shopStore/shopStore";

export function WarningResetPlayStore() {
	console.log("All data has been initialized");
	clientLoop.reset();
	initPlayerStore();
	initShopStore();
}