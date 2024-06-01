import { FastifyInstance } from "fastify";
import GetContentHandler from "./GetContent";
import GetPostContentHandler from "./PostContent";
import GetPostUploadFile from "./PostUplodaFile";
import { AppState } from "../appStore";

export default function routes(server: FastifyInstance, state: AppState) {
	server.get("/", GetContentHandler(state));
	server.post("/", GetPostContentHandler(state));
	server.post("/upload", GetPostUploadFile(state));
}
