import Fastify from "fastify";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { v4 as uuidv4 } from "uuid";
import { pipeline } from "stream";
import util from "util";
import { exit } from "process";
// import { EditorData } from '../src/editor/type/type';

const dir = `${process.cwd()}/data`;
const imagesDir = `${dir}/images`;
const dataFile = `${dir}/data.json`;
if (!existsSync(dir)) {
  mkdirSync(dir);
}
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir);
}
let content = "";
try {
  content = await readFileSync(dataFile, "utf8");
} catch (e) {
  writeFileSync(dataFile, "{}");
}

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler() {
  return content;
});

fastify.post("/", async function handler(request) {
  const valueObject = JSON.parse(request.body as string) as any;
  const allImagesSrc = new Set<string>();
  valueObject.cards.forEach((card) => {
    card.stats.forEach((stat) => {
      if (stat.illustration) {
        allImagesSrc.add(stat.illustration);
      }
    });
  });
  valueObject.worlds?.forEach((world) => {
    world.illustration && allImagesSrc.add(world.illustration);
    world.cardBackground && allImagesSrc.add(world.cardBackground);
  });
  removeUnusedImages(allImagesSrc);

  const value = JSON.stringify(request.body);

  writeFileSync(`${dir}/data.json`, value);
  content = value;
  return { status: "ok" };
});

function removeUnusedImages(allImagesSrc: Set<string>) {
  // get all files in the directory ending with jpg, jpeg or png
  const files = readdirSync(dir).filter(
    (file) =>
      file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"),
  );
  // remove all files that are not in the set
  files.forEach((file) => {
    if (!allImagesSrc.has(`${imagesDir}/${file}`)) {
      unlinkSync(`${imagesDir}/${file}`);
    }
  });
}

const pump = util.promisify(pipeline);

fastify.post("/upload", async (request) => {
  const data = await request.file();
  if (!data) {
    return { error: true };
  }
  const fileName = `${uuidv4()}.${data.filename.split(".").pop()}`;
  await pump(data.file, createWriteStream(`data/images/${fileName}`));
  return { fileName: fileName };
});

fastify.register(multipart);
fastify.register(cors, {
  // Set your CORS options here
  origin: "*", // Change this to your desired origin or set it dynamically based on request headers
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
