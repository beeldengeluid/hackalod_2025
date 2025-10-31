import Debug from 'debug'
const debug = Debug("hackalod:app")

import express, { Request, Response } from "express"
import { generateRandomName } from "./randomName"
import {LIST_PEOPLE_THAT_LIVED_IN_YEAR} from "./queries"
import {generateGuessIncorrectBirthYearQ, generateGuessCorrectInfluence} from "./questionGenerator"
import {getAlbumTracks, getSomeTriplesFromMuziekWebInternal} from "./muziekWeb"
import { dummyQuestions } from './dummy-questions'

export function createApp() {
	const app = express()

	app.use((req, res, next) => {
		debug({ method: req.method, url: req.url })
		next()
	})

	app.get("/api/random-name", (_req: Request, res: Response) => {
		res.json({ name: generateRandomName() })
	})

	app.get("/api/random-question", async (_req: Request, res: Response) => {
		const question = dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];
		debug("Serving question:", question);
		res.json(question);
	})
	
	app.get("/api/random-mw-internal", async (_req: Request, res: Response) => {
		const triples = await getSomeTriplesFromMuziekWebInternal();
		res.json(triples);
	})

	app.get("/api/get-album/:album_id", async (_req: Request, res: Response) => {
		const triples = await getAlbumTracks(_req.params.album_id);
		res.json(triples);
	})

	app.get("/api/question1", async (_req: Request, res: Response) => {
		const question = await generateGuessIncorrectBirthYearQ();
		res.json(question);
	})

	app.get("/api/question2", async (_req: Request, res: Response) => {
		const question = await generateGuessCorrectInfluence();
		res.json(question);
	})

	return app
}
