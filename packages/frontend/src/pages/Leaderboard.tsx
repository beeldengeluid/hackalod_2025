import { IconSparkles } from "@tabler/icons-react"
import React, { useContext, useEffect, useState } from "react"
import { SESSION_STORAGE_KEY } from "../consts"
import { UNKNOWN_PLAYER_NAME } from "../consts"

import styles from "./Question/index.module.css"
import lbStyles from "./Leaderboard.module.css"
import clsx from "clsx"
import { Button } from "../components/Button"
import { DispatchContext } from "../state"
import { Actions } from "../state/actions"
import { useNavigate } from "react-router-dom"

export function Leaderboard() {
	const leaderboard = useLeaderboard()
	const username =
		sessionStorage.getItem(SESSION_STORAGE_KEY) ?? UNKNOWN_PLAYER_NAME
	const dispatch = useContext(DispatchContext)
	const navigate = useNavigate()

	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>
				De beste LOD
				<span style={{ textTransform: "lowercase" }}>sters</span>
			</h2>
			<div className={lbStyles.grid}>
				{leaderboard.map((entry, index) => (
					<React.Fragment key={index}>
						<div className={lbStyles.position}>{index + 1}</div>
						<div
							className={clsx(lbStyles.name, {
								[lbStyles.active]: entry.userName === username,
							})}
						>
							{entry.userName}
						</div>
						<div className={lbStyles.score}>
							<IconSparkles size={24} color="yellow" /> {entry.score}
						</div>
					</React.Fragment>
				))}
			</div>
			<Button
				onClick={() => {
					dispatch({ type: Actions.RESET })
					navigate("/question")
				}}
			>
				Speel nog een keer!
			</Button>
		</div>
	)
}

function useLeaderboard() {
	const [leaderboard, setLeaderboard] = useState<
		Array<{ userName: string; score: number }>
	>([])

	useEffect(() => {
		fetch("/api/leaderboard")
			.then((res) => res.json())
			.then((data) => {
				setLeaderboard(data)
			})
	}, [])

	return leaderboard
}
