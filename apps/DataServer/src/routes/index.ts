import { FastifyInstance } from "fastify";
import GetGetContentHandler from "./GetContent";
import GetPostContentHandler from "./PostContent";
import GetPostUploadFile from "./PostUplodaFile";
import { AppState } from "../appStore";

export default function routes(server: FastifyInstance, state: AppState) {
	// Get
	server.get("/", GetGetContentHandler(state));

	// #ESBUILD_IGNORE_START
	// Post
	server.post("/", GetPostContentHandler(state));
	server.post("/upload/:fileName", GetPostUploadFile());
	// #ESBUILD_IGNORE_END
}
