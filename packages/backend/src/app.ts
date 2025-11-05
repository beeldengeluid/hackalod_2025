import Debug from "debug"
const debug = Debug("lodster:app")

import express, { Request, Response } from "express"
import { getAlbumTracks } from "./muziekWeb"
import { dummyQuestions } from "./dummy-questions"
import { stat, writeFile } from "fs/promises"
import { handleLeaderboard } from "./endpoints/leaderboard"
import { loadRandomQuestion, loadQuestion } from "./questions/load"
import { handleImage } from "./endpoints/image"

export function createApp() {
	const app = express()

	app.use(express.json())

	app.use((req, res, next) => {
		debug({ method: req.method, url: req.url })
		next()
	})

	handleLeaderboard(app)
	handleImage(app)

	app.get("/api/random-question", async (_req: Request, res: Response) => {
		const question =
			dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)]
		debug("Serving question:", question)
		res.json(question)
	})

	app.get("/api/get-album/:album_id", async (_req: Request, res: Response) => {
		const triples = await getAlbumTracks(_req.params.album_id)
		res.json(triples)
	})

	app.get("/api/question/_random", async (_req: Request, res: Response) => {
		const triples = await loadRandomQuestion()
		if (triples == null) {
			res.status(404).json({ error: "Question not found" })
			return
		}
		res.json(triples)
	})

	app.get("/api/question/:case", async (_req: Request, res: Response) => {
		const triples = await loadQuestion(parseInt(_req.params.case))
		if (triples == null) {
			res.status(404).json({ error: "Question not found" })
			return
		}
		res.json(triples)
	})

	return app
}
