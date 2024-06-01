import initFs from "./src/initFs";
import appStore from "./src/appStore";
import initServer from "./src/Server";
import routes from "./src/routes";

(async function main() {
	const { content } = initFs();
	const state = appStore({ content });
	const { server, startServer } = await initServer();
	routes(server, state);
	startServer();
})()