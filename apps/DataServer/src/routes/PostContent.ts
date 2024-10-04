import { writeFileSync, readdirSync, unlinkSync } from 'fs';
import { AppState } from "../appStore";
import { dir, imagesDir } from '../initFs';
import { FastifyRequest } from 'fastify';
import { purifyAppState } from './validateEditorData/validateEditorData';
import { EditorData } from 'game_engine';

export default function GetPostContentHandler(state: AppState) {
	return function handler(request: FastifyRequest) {
		const valueObject = purifyAppState(JSON.parse(request.body as string));

		purgeImages(valueObject);

		const value = beautifyJson(valueObject);

		writeFileSync(`${dir}/data.json`, value);
		state.updateContent(value);
		return { status: "ok" };
	}
}

function getAllImagesSrc(valueObject: EditorData) {
	const allImagesSrc = new Set<string>();
	valueObject.cards.forEach((card) => {
		card.stats.forEach((stat) => {
			if (stat.illustration) {
				allImagesSrc.add(stat.illustration);
			}
		});
	});
	valueObject.worlds?.forEach((world) => {
		world.illustration && allImagesSrc.add(world.illustration);
		world.cardBackground && allImagesSrc.add(world.cardBackground);
	});
	return allImagesSrc;
}

function purgeImages(valueObject: EditorData) {
	const allImagesSrc = getAllImagesSrc(valueObject);
	// get all files in the directory ending with jpg, jpeg or png
	const files = readdirSync(imagesDir);
	// remove all files that are not in the set
	files.forEach((file) => {
		if (!allImagesSrc.has(file)) {
			unlinkSync(`${imagesDir}/${file}`);
		}
	});
}

function beautifyJson(jsonObject: unknown) {
	return JSON.stringify(jsonObject, null, 2);
}