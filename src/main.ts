import cors from "cors";
import cron from "node-cron";
import http from "http";

import { Request, Response } from "express";

import { app } from "track";
import { getPosts } from "track";
import { getWantlist } from "track";
import { scanReddit } from "track";
import { updateWantlist } from "track";
import { logger } from "track";

const PORT: number = Number(process.env.PORT) || 5000;
const env = process.env.NODE_ENV || "dev";
const startMessage = `${env} server up listening on http://localhost:${PORT}`;

const server = http.createServer(app);

const auth: any[] = [process.env.URL_FRONTEND, process.env.URL_LOCAL];

const corsConfig = {
	credentials: true,
	origin: auth,
};

app.use(cors(corsConfig));

app.get("/", async (req: Request, res: Response) => {
	const data = await getPosts();
	res.json({ data });
});

app.get("/posts", async (req: Request, res: Response) => {
	const data = await getPosts();
	res.json({ data });
});

app.get("/wantlist", async (req: Request, res: Response) => {
	const data = await getWantlist();
	res.json({ data });
});

app.post("/wantlist", async (req: Request, res: Response) => {
	const data = await updateWantlist();
	res.json({ data });
});

server.listen(PORT);

server.on("listening", () => {
	logger.info(startMessage);

	// Run every 15 seconds
	cron.schedule("*/15 * * * * *", async () => {
		await scanReddit();
	});

	// Run every day
	// cron.schedule("* * * */1 * *", async () => {
	// await updateWantlist();
	// });
});
