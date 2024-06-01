import { AppState } from "../appStore";
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from "uuid";
import { pipeline } from "stream";
import util from "util";

const pump = util.promisify(pipeline);

export default function GetPostUploadFile(state: AppState) {
	return async function handler(request) {
		const data = await request.file();
		if (!data) {
			return { error: true };
		}
		const fileName = `${uuidv4()}.${data.filename.split(".").pop()}`;
		await pump(data.file, createWriteStream(`data/images/${fileName}`));
		return { fileName: fileName };
	}
}