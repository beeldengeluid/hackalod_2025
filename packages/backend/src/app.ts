import express, { Request, Response } from "express"
import { generateRandomName } from "./randomName"
import {getSomeTriplesFromMuziekWeb} from "./muziekWeb"


export function createApp() {
	const app = express()

	app.get("/random-name", (_req: Request, res: Response) => {
		res.json({ name: generateRandomName() })
	})

	app.get("/random-question", async (_req: Request, res: Response) => {
		const triples = await getSomeTriplesFromMuziekWeb();
		res.json(triples);
	})

	return app
}
