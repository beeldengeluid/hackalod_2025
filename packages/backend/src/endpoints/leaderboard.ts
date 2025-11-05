import Debug from 'debug'
const debug = Debug("lodster:leaderboard")

import { type Express, type Request, type Response } from "express"

interface LeaderboardEntry {
	date: string
	userName: string
	score: number
}

const leaderboard: {
	values: LeaderboardEntry[]
} = {
	values: [],
}

export function handleLeaderboard(app: Express) {
	app.get("/api/leaderboard", (_req: Request, res: Response) => {
		res.json(leaderboard.values)
	})

	app.post("/api/leaderboard", (req: Request, res: Response) => {
		const entry = req.body
		const currentDate = new Date().toISOString()

		debug({
			currentDate,
			entry,
		})

		leaderboard.values
			.push({
				...entry,
				date: currentDate,
			})

		const x = leaderboard.values.reduce((acc, curr) => {
			const key = `${curr.userName}-${curr.date.slice(0,19)}`
			// if (!acc[key] || acc[key].score < curr.score) {
			// 	acc[key] = curr
			// }
			acc[key] = curr
			return acc
		}, {} as Record<string, LeaderboardEntry>)

		leaderboard.values = Object.values(x)

		// keep only top 10
		leaderboard.values.sort((a, b) => b.score - a.score)

		leaderboard.values = leaderboard.values.slice(0, 10)

		res.status(201).json({
			leaderboard,
			userPosition: leaderboard.values.findIndex((e => e.date === currentDate)) + 1,	
		})
	})
}
