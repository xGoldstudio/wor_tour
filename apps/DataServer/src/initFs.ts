import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

export const dir = `${process.cwd()}/data`;
export const imagesDir = `${dir}/images`;
export const dataFile = `${dir}/data.json`;

export default function initFs() {
	if (!existsSync(dir)) {
		mkdirSync(dir);
	}
	if (!existsSync(imagesDir)) {
		mkdirSync(imagesDir);
	}
	let content = "";
	try {
		content = readFileSync(dataFile, "utf8");
	} catch (e) {
		writeFileSync(dataFile, "{}");
	}

	return { dir, imagesDir, dataFile, content };
}