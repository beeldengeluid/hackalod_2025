import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import clsx from "clsx"
import {
	type Question,
} from "@lodster/common"
import { IconHelpHexagonFilled, IconSparkles } from "@tabler/icons-react"

import { AnswerStatus, DispatchContext, StateContext } from "../../state"
import { Action, Actions } from "../../state/actions"
import { Button } from "../../components/Button"
import { SESSION_STORAGE_KEY, TIMEOUT_SECONDS } from "../../consts"

import { Choice } from "./Choice"
import { Iframe } from "./Iframe"
import { Timer } from "./Timer"

import styles from "./index.module.css"

// Keep track of the number of consecutive errors, to avoid infinite retries
let errorCount = 0
async function getQuestion(dispatch: React.Dispatch<Action>) {
	// const response = await fetch(`/api/question/${QuestionCase.TrackPerformer}`)
	const response = await fetch(`/api/question/_random`)
	if (!response.ok) {
		errorCount++
		// Retry fetching the question up to 10 times
		if (errorCount <= 10) getQuestion(dispatch)
		else throw new Error("Could not fetch question after 10 attempts")
		return
	}

	// Reset the error count on a successful fetch
	errorCount = 0
	const question: Question = await response.json()
	dispatch({ type: Actions.SET_QUESTION, payload: { question } })
}

export function QuestionPage() {
	const dispatch = useContext(DispatchContext)
	const { current, total, question, score, status } = useContext(StateContext)
	const isLastQuestion = current >= total

	if (status === AnswerStatus.Unset) getQuestion(dispatch)

	return (
		<div className={clsx("page", styles.page)}>
			<div className="backdrop" aria-hidden="true" />
			<div className={styles.container}>
				<header className={clsx(styles.card, styles.header)}>
					<span className={styles.paginator}>
						<IconHelpHexagonFilled size="36" color="yellow" /> {current}{" "}
						of {total}
					</span>
					{status === AnswerStatus.Unanswered &&
						question?.musicSample == null && (
							<Timer time={TIMEOUT_SECONDS} dispatch={dispatch} />
						)}
					<span className={styles.paginator}>
						<IconSparkles size="36" color="yellow" /> {score}
					</span>
				</header>
				<main className="">
					<div
						className={clsx(styles.card, {
							[styles.loadingCard]: status === AnswerStatus.Loading,
						})}
					>
						{status === AnswerStatus.Loading && (
							<>
								<div className={styles.loader} aria-hidden="true" />
								<span className={styles.loaderText}>
									Vraag wordt geladen…
								</span>
							</>
						)}
						{status == AnswerStatus.Unanswered && (
							<ChoicesBody question={question} />
						)}
						{status === AnswerStatus.Correct && (
							<CorrectAnswerBody
								dispatch={dispatch}
								isLastQuestion={isLastQuestion}
							/>
						)}
						{status === AnswerStatus.Incorrect && (
							<IncorrectAnswerBody
								dispatch={dispatch}
								isLastQuestion={isLastQuestion}
								question={question!}
							/>
						)}
						{status === AnswerStatus.TimedOut && (
							<TimedOutAnswerBody
								dispatch={dispatch}
								isLastQuestion={isLastQuestion}
							/>
						)}
						{status === AnswerStatus.Done && (
							<DoneAnwserBody dispatch={dispatch} score={score} />
						)}
					</div>
				</main>
			</div>
		</div>
	)
}

function ChoicesBody({ question }: { question: Question | undefined }) {
	if (!question) return null
	return (
		<div className={styles.choicesBody}>
			<h2 className={styles.question}>
				{question.text}
				<Iframe question={question} />
			</h2>
			{question.choices.map((choice) => (
				<Choice key={choice.uri} choice={choice} />
			))}
		</div>
	)
}

function CorrectAnswerBody({
	dispatch,
	isLastQuestion,
}: {
	dispatch: React.Dispatch<Action>
	isLastQuestion: boolean
}) {
	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>Goed gedaan!</h2>
			<p>
				Je hebt een <IconSparkles size={72} color="yellow" /> verdiend!
			</p>
			<NextButton dispatch={dispatch} isLastQuestion={isLastQuestion} />
		</div>
	)
}

function IncorrectAnswerBody({
	dispatch,
	isLastQuestion,
	question
}: {
	dispatch: React.Dispatch<Action>
	isLastQuestion: boolean
	question: Question
}) {
	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>Helaas!</h2>
			<p style={{ flexDirection: 'column' }}>Het goede antwoord was: <span style={{color: 'yellow' }}>{question.anwser.label}</span></p>
			<p>
				Je hebt geen <IconSparkles size={72} color="gray" /> verdiend
			</p>
			<NextButton dispatch={dispatch} isLastQuestion={isLastQuestion} />
		</div>
	)
}

function TimedOutAnswerBody({
	dispatch,
	isLastQuestion,
}: {
	dispatch: React.Dispatch<Action>
	isLastQuestion: boolean
}) {
	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>
				Oeps!
				<br />
				De tijd is verstreken
			</h2>
			<p>
				Je hebt geen <IconSparkles size={72} color="gray" /> verdiend
			</p>
			<NextButton dispatch={dispatch} isLastQuestion={isLastQuestion} />
		</div>
	)
}

function NextButton({
	dispatch,
	isLastQuestion,
}: {
	dispatch: React.Dispatch<Action>
	isLastQuestion: boolean
}) {
	return (
		<Button
			onClick={() => {
				dispatch({
					type: Actions.SET_QUESTION,
					payload: { question: undefined },
				})

				if (!isLastQuestion) {
					getQuestion(dispatch)
				}
			}}
		>
			{isLastQuestion ? "Bekijk je eindscore!" : "Volgende vraag"}
		</Button>
	)
}

function DoneAnwserBody({
	dispatch,
	score,
}: {
	dispatch: React.Dispatch<Action>
	score: number
}) {
	const [position, setPosition] = useState<number>()

	useEffect(() => {
		fetch("/api/leaderboard", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userName:
					sessionStorage.getItem(SESSION_STORAGE_KEY) ??
					"Onbekende Speler",
				score,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Leaderboard updated:", data)
				setPosition(data.userPosition)
			})
	}, [])

	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>
				Score {sessionStorage.getItem(SESSION_STORAGE_KEY)}
			</h2>
			<p
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<span>
					Je hebt totaal <span style={{ color: "yellow" }}>{score}</span>{" "}
					<IconSparkles size={72} color="yellow" /> verdiend
				</span>
				{position != null && position > 0 && position < 10 ? (
					<span>
						Je staat op de{" "}
						<Link style={{ textDecoration: "none" }} to="/leaderboard">
							<span style={{ color: "yellow" }}>{position}de</span>
						</Link>{" "}
						plaats!
					</span>
				) : (
					<span>
						Helaas niet bij de{" "}
						<Link className={styles.yellow} to="/leaderboard">
							eerst 10
						</Link>
					</span>
				)}
			</p>
			<Button onClick={() => dispatch({ type: Actions.RESET })}>
				Speel nog een keer!
			</Button>
		</div>
	)
}
