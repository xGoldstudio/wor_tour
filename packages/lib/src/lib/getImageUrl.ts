const DATA_SERVER_URL = 'http://localhost:3000';
export function getImageUrl(url: string | null) {
	if (!url) {
		return "";
	}
	return `${DATA_SERVER_URL}/public/${url}`;
}
