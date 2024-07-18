const DATA_SERVER_URL = 'http://localhost:3000';
export function getImageUrlCssValue(url: string | null) {
	if (!url) {
		return undefined;
	}
	return `url(${getImageUrl(url)})`;
}

export function getImageUrl(url: string | null) {
	if (!url) {
		return undefined;
	}
	return `${DATA_SERVER_URL}/public/${url}`;
}