import { writeFileSync, readdirSync, unlinkSync } from 'fs';
import { AppState } from "../appStore";
import { dir, imagesDir } from '../initFs';

export default function GetPostContentHandler(state: AppState) {
	return function handler(request) {
		const valueObject = JSON.parse(request.body as string) as any;
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
		removeUnusedImages(allImagesSrc);
	
		const value = JSON.stringify(request.body);
	
		writeFileSync(`${dir}/data.json`, value);
		state.updateContent(value);
		return { status: "ok" };
	}
}

function removeUnusedImages(allImagesSrc: Set<string>) {
  // get all files in the directory ending with jpg, jpeg or png
  const files = readdirSync(dir).filter(
    (file) =>
      file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"),
  );
  // remove all files that are not in the set
  files.forEach((file) => {
    if (!allImagesSrc.has(`${imagesDir}/${file}`)) {
      unlinkSync(`${imagesDir}/${file}`);
    }
  });
}