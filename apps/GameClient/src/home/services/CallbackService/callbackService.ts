
/**
 * @description This service is used to call callbacks from data loaded in the local storage
 */
export function CallbackService<T extends string>(callbacks: Record<T, () => void>) {
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
