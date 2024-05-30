import Fastify from 'fastify';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import cors from '@fastify/cors'

const dir = `${process.cwd()}/public/editor`;
if (!existsSync(dir)) {
	mkdirSync(dir);
}
let content = "";
try {
	content = await readFileSync(`${dir}/card.json`, 'utf8');
} catch (e) {
	writeFileSync(`${dir}/card.json`, '{}');
}

const fastify = Fastify({
	logger: true
})

// Declare a route
fastify.get('/', async function handler() {
	return content;
});

fastify.post('/', async function handler(request) {
	const value = JSON.stringify(request.body);
	writeFileSync(`${dir}/card.json`, value);
	content = value;
	return { status: 'ok' };
});

fastify.register(cors, {
	// Set your CORS options here
	origin: '*', // Change this to your desired origin or set it dynamically based on request headers
});

try {
	await fastify.listen({ port: 3000 })
} catch (err) {
	fastify.log.error(err)
	process.exit(1)
}