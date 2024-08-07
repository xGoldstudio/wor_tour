import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { imagesDir } from './initFs';

export default async function initServer() {
	const fastify = Fastify({
		logger: true,
		bodyLimit: 1048576 * 100, // 100MB
	});

	fastify.register(multipart, {
		limits: {
			fileSize: 1048576 * 100, // 100MB
		}
	});
	fastify.register(cors, {
		// Set your CORS options here
		origin: "*", // Change this to your desired origin or set it dynamically based on request headers
	});
	fastify.register(fastifyStatic, {
		root: imagesDir,
		prefix: '/public/',
		immutable: true,
		maxAge: 31536000,
	});

	async function startServer() {
		try {
			await fastify.listen({ port: 3000 });
		} catch (err) {
			fastify.log.error(err);
			process.exit(1);
		}
	}

	return { server: fastify, startServer };
}