import { setCardsToBuy } from "../../store/shopStore/shopStore";
import { dailyGoldService } from "../DailyGoldService/dailyGoldService";

/**
 * @description This service is used to call callbacks from data loaded in the local storage
 */
function CallbackService<T extends string>(callbacks: Record<T, () => void>) {
	function call(callbackName: T) {
		const callback = callbacks[callbackName];
		if (callback) {
			callback();
		} else {
			console.warn(`CallbackService: ${callbackName} not found`);
		}
	}

	return {
		call,
	};
}

export const callbackService = CallbackService({
	"setCardsToBuy": setCardsToBuy,
	"resetDailyGold": dailyGoldService.setDailyGold,
});

export type CallbackServiceName = Parameters<typeof callbackService.call>[0];
