const DATA_SERVER_URL = 'http://localhost:3000';
export function getImageUrlCssValue(base: string, url: string | null) {
	if (!url) {
		return undefined;
	}
	return `url(${getImageUrl(base, url)})`;
}

export function getImageUrl(base: string, url: string | null) {
	if (!url) {
		return "";
	}
	return `${DATA_SERVER_URL}/public/${base}/${url}`;
}

const staticSrc = "static";
export const TEXTURE = staticSrc + "/textures";
export const COMMON = staticSrc;
export const CHEST = staticSrc + "/chests";
export const ICONS = staticSrc + "/icons";
export const GAME_TEXTURE = staticSrc + "/gameTextures";
export const FOOTER_SRC = staticSrc + "/footer";
export const EDITOR_SRC = "images"
export const STATES_SRC = staticSrc + "/states";