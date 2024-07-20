export const formatTime = (time: number) => {
	if (time <= 0) {
		return "00:00:00";
	}
	const hours = Math.floor(time / 3600000);
	const minutes = Math.floor((time % 3600000) / 60000);
	const seconds = Math.floor((time % 60000) / 1000);
	return `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};