import { getSecondsFromDays } from "@repo/lib";
import { KeysService } from "./KeysService/KeysService";
import { DailyGoldService } from "./DailyGoldService/dailyGoldService";
import { CallbackService } from "./CallbackService/callbackService";
import { MatchmakingService } from "./MatchmakingService/matchmakingService";
import { ClientLoop } from "./LoopService/clientLoopService";
import { CARDS_ROTATION_TIME, setCardsToBuy } from "@/home/store/shopStore/shopStore";

export const keysService = KeysService();

export const dailyGoldService = DailyGoldService();

export const callbackService = CallbackService({
	"addKey": keysService.addKey,
	"setCardsToBuy": setCardsToBuy,
	"resetDailyGold": dailyGoldService.setDailyGold,
});
export type CallbackServiceName = Parameters<typeof callbackService.call>[0];

export const matchmakingService = MatchmakingService();

export const clientLoop = ClientLoop([
	{ name: "cardRotationShop", callbackName: "setCardsToBuy", duration: CARDS_ROTATION_TIME },
	{ name: "dailyGold", callbackName: "resetDailyGold", duration: getSecondsFromDays(1) }
]);
clientLoop.start();
