import initFs from "./initFs";
import appStore from "./appStore";
import initServer from "./main";
import routes from "./routes";

(async function main() {
	const { content } = initFs();
	const state = appStore({ content });
	const { server, startServer } = await initServer();
	routes(server, state);
	startServer();
	console.log("hey")
	
})()
