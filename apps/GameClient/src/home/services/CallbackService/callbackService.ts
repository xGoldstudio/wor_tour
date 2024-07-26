import { setCardsToBuy } from "../../store/shopStore/shopStore";

/**
 * @description This service is used to call callbacks from data loaded in the local storage
 */
function CallbackService(callbacks: Record<string, () => void>) {
	function call(callbackName: string) {
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
});