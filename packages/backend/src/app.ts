import express, { Request, Response } from "express"
import { generateRandomName } from "./randomName"
import {getSomeTriplesFromMuziekWeb, getAlbumTracks, getSomeTriplesFromMuziekWebInternal} from "./muziekWeb"
import { dummyQuestions } from './dummy-questions'


export function createApp() {
	const app = express()

	app.get("/api/random-name", (_req: Request, res: Response) => {
		res.json({ name: generateRandomName() })
	})

	app.get("/api/random-question", async (_req: Request, res: Response) => {
		const question = dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];
		res.json(question);
	})

	app.get("/api/random-triples", async (_req: Request, res: Response) => {
		const triples = await getSomeTriplesFromMuziekWeb();
		res.json(triples);
	})

	app.get("/api/random-mw-internal", async (_req: Request, res: Response) => {
		const triples = await getSomeTriplesFromMuziekWebInternal();
		res.json(triples);
	})

	app.get("/api/get-album/:album_id", async (_req: Request, res: Response) => {
		const triples = await getAlbumTracks(_req.params.album_id);
		res.json(triples);
	})

	return app
}
