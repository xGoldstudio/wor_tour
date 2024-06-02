import { createWriteStream } from 'fs';
import { pipeline } from "stream";
import util from "util";
import { FastifyRequest } from 'fastify';

const pump = util.promisify(pipeline);

export default function GetPostUploadFile() {
	return async function handler(request: FastifyRequest) {
		const fileName = (request.params as { fileName: string }).fileName;
		const data = await request.file();
		if (!data) {
			return { error: true };
		}
		const extension = data.filename.split('.').pop();
		const completeFileName = `${fileName}_${Date.now()}.${extension}`;
		await pump(data.file, createWriteStream(`data/images/${completeFileName}`,));
		return { fileName: completeFileName };
	}
}