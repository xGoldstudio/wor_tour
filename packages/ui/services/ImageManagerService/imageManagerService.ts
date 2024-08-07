import { getImageUrl } from "@repo/lib";

function ImageManager() {
	const cache: Map<string, string> = new Map();

	async function loadImage(url: string): Promise<string> {
		// Check if the image is already in the cache
		if (cache.has(url)) {
			return cache.get(url)!;
		}

		// If not in cache, fetch the image
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const base64 = await blobToBase64(blob);

			// Store in cache
			cache.set(url, base64);

			return base64;
		} catch (error) {
			console.error('Error loading image:', error);
			throw error;
		}
	}

	async function blobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}

	function preloadImages(urls: string[]): Promise<string[]> {
		return Promise.all(urls.map(url => loadImage(url)));
	}

	function getImage(url: string): string {
		const image = cache.get(url);
		if (image) {
			return image;
		}
		console.warn("Image not found in cache", url);
		return ""
	}

	function clearCache(): void {
		cache.clear();
	}

	return {
		clearCache,
		loadImage,
		preloadImages,
		getImage,
	}
}

export default function ImageManagerService() {
	const imageManager = ImageManager();

	function getImage(url: string | null | undefined) {
		if (!url) {
			return "";
		}
		return imageManager.getImage(getImageUrl(url));
	}
	function getImageCss(url: string | null | undefined) {
		return `url(${getImage(url)})`;
	}
	function loadImages(urls: string[]) {
		return imageManager.preloadImages(urls.map(getImageUrl));
	}

	return {
		getImage,
		getImageCss,
		loadImages,
	}
}