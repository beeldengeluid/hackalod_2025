import Debug from "debug"
const debug = Debug("hackalod:app")

import express, { Request, Response } from "express"
import { generateRandomName } from "./randomName"
import { loadQuestion } from "./questionGenerator"
import { getAlbumTracks } from "./muziekWeb"
import { dummyQuestions } from "./dummy-questions"
import { mkdir, stat, writeFile } from "fs/promises"
import { join } from "path"
import { createHash } from "crypto"

const CACHE_DIR = join(process.cwd(), "../../", "data", "image-cache")

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
		const question =
			dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)]
		debug("Serving question:", question)
		res.json(question)
	})

	app.get("/api/get-album/:album_id", async (_req: Request, res: Response) => {
		const triples = await getAlbumTracks(_req.params.album_id)
		res.json(triples)
	})

	app.get("/api/question/:num", async (_req: Request, res: Response) => {
		const triples = await loadQuestion(parseInt(_req.params.num))
		res.json(triples)
	})

	app.get("/api/image/:url", async (req, res, next) => {
		const url = decodeURI(req.params.url)
		const target = join(
			CACHE_DIR,
			`${createHash("sha256").update(url).digest("hex")}.jpg`,
		)

		let job = inFlight.get(target)
		if (!job) {
			job = ensureCached(url, target).finally(() => inFlight.delete(target))
			inFlight.set(target, job)
		}

		try {
			await job
			res.sendFile(target)
		} catch (err) {
			next(err)
		}
	})

	return app
}

const inFlight = new Map<string, Promise<void>>()

async function ensureCached(url: string, target: string) {
	try {
		await stat(target)
		return
	} catch {
		const res = await fetch(url)
		if (!res.ok) {
			debug(res.status, res.statusText)
			return
		}
		const buf = Buffer.from(await res.arrayBuffer())
		await mkdir(CACHE_DIR, { recursive: true })
		await writeFile(target, buf)
	}
}
