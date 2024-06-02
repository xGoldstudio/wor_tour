import { EditorData } from '@repo/types';
import { writeFileSync, readdirSync, unlinkSync } from 'fs';
import { AppState } from "../appStore";
import { dir, imagesDir } from '../initFs';
import { FastifyRequest } from 'fastify';

export default function GetPostContentHandler(state: AppState) {
	return function handler(request: FastifyRequest) {
		const valueObject = JSON.parse(request.body as string) as EditorData;
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

		purgeImages(allImagesSrc);

		const value = beautifyJson(valueObject);
	
		writeFileSync(`${dir}/data.json`, value);
		state.updateContent(value);
		return { status: "ok" };
	}
}

function purgeImages(allImagesSrc: Set<string>) {
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
	return JSON.stringify(jsonObject, null, 2)
			.replace(/":\s+/g, '": ')
			.replace(/,{/g, ',\n{')
			.replace(/],/g, '],\n')
			.replace(/}]/g, '}\n]');
}