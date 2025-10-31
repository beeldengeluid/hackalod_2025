import express, { Request, Response } from "express"
import { generateRandomName } from "./randomName"
import {runMuziekWebQuery, getAlbumTracks, getSomeTriplesFromMuziekWebInternal} from "./muziekWeb"
import {LIST_PEOPLE_THAT_LIVED_IN_YEAR} from "./queries"

export function createApp() {
	const app = express()

	app.get("/random-name", (_req: Request, res: Response) => {
		res.json({ name: generateRandomName() })
	})

	app.get("/mw-query", async (_req: Request, res: Response) => {
		const triples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR);
		res.json(triples);
	})

	app.get("/random-mw-internal", async (_req: Request, res: Response) => {
		const triples = await getSomeTriplesFromMuziekWebInternal();
		res.json(triples);
	})

	app.get("/get-album/:album_id", async (_req: Request, res: Response) => {
		const triples = await getAlbumTracks(_req.params.album_id);
		res.json(triples);
	})

	return app
}
