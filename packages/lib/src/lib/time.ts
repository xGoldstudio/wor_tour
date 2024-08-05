export interface FormatTimeOptions {
	removeHours?: boolean;
}

export const formatTime = (seconds: number, options?: FormatTimeOptions) => {
	if (seconds <= 0) {
		return "00:00:00";
	}
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const hoursStr = hours.toString().padStart(2, "0");
	const minutesStr = minutes.toString().padStart(2, "0");
	const secondsStr = remainingSeconds.toString().padStart(2, "0");
	return options?.removeHours
		? `${minutesStr}:${secondsStr}`
		: `${hoursStr}:${minutesStr}:${secondsStr}`;
};