import Debug from "debug"
const debug = Debug("lodster:endpoints:image")

import { type Express } from "express"

import { createHash } from "crypto"
import { mkdir, stat, writeFile } from "fs/promises"
import { join } from "path"

const inFlight = new Map<string, Promise<void>>()

const CACHE_DIR = join(process.cwd(), "../../", "data", "image-cache")
const cacheDirReady = mkdir(CACHE_DIR, { recursive: true }).catch((error) => {
	debug("Failed to prepare cache directory", error)
	throw error
})

export function handleImage(app: Express) {
	app.get("/api/image/:url", async (req, res, next) => {
		const url = decodeURIComponent(req.params.url)
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
			await cacheDirReady
			res.sendFile(target)
		} catch (err) {
			next(err)
		}
	})
}

async function ensureCached(url: string, target: string) {
	await cacheDirReady
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
		// await mkdir(CACHE_DIR, { recursive: true })
		await writeFile(target, buf)
	}
}