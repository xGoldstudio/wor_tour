import { FastifyInstance } from "fastify";
import GetGetContentHandler from "./GetContent";
import GetPostContentHandler from "./PostContent";
import GetPostUploadFile from "./PostUplodaFile";
import { AppState } from "../appStore";
import GetGetStaticFileHandler from "./GetStaticContent";

export default function routes(server: FastifyInstance, state: AppState) {
	// Get
	server.get("/", GetGetContentHandler(state));

	// Post
	server.post("/", GetPostContentHandler(state));
	server.post("/upload", GetPostUploadFile(state));
}
