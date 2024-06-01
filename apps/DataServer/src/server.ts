import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

export default async function initServer() {
	const fastify = Fastify({
		logger: true,
	});
	
	fastify.register(multipart);
	fastify.register(cors, {
		// Set your CORS options here
		origin: "*", // Change this to your desired origin or set it dynamically based on request headers
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