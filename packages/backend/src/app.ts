import express, { Request, Response } from "express"
import { generateRandomName } from "./randomName"

export function createApp() {
	const app = express()

	app.get("/random-name", (_req: Request, res: Response) => {
		res.json({ name: generateRandomName() })
	})

	return app
}
