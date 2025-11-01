import { useContext, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { QuestionType, type Question } from "@hackalod2025/common"
import { Choice } from "./Choice"

import { AnswerStatus, DispatchContext, StateContext } from "../../state"
import { IconHelpHexagonFilled, IconSparkles } from "@tabler/icons-react"
import { Action, Actions } from "../../state/actions"

import styles from "./index.module.css"
import { Iframe } from "./Iframe"

export function QuestionPage() {
	const dispatch = useContext(DispatchContext)
	const { current, total, question, score, status } = useContext(StateContext)

	if (!question) {
		getQuestion(dispatch)
		return null
	}

	const isLastQuestion = current >= total

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
						question.musicSample == null && (
							<Timer time={12} dispatch={dispatch} />
						)}
					<span className={styles.paginator}>
						<IconSparkles size="36" color="yellow" /> {score}
					</span>
				</header>
				<main className="">
					<div className={styles.card}>
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

function ChoicesBody({ question }: { question: Question }) {
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
}: {
	dispatch: React.Dispatch<Action>
	isLastQuestion: boolean
}) {
	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>Helaas!</h2>
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
		<button className={styles.button} onClick={() => getQuestion(dispatch)}>
			{isLastQuestion ? "Bekijk je eindscore!" : "Volgende vraag"}
		</button>
	)
}

function DoneAnwserBody({ dispatch, score }: { dispatch: React.Dispatch<Action>, score: number }) {
	return (
		<div className={styles.answerBody}>
			<h2 className={styles.correct}>
				Score
			</h2>
			<p>
				Je hebt totaal <span style={{ color: 'yellow' }}>{score}</span> <IconSparkles size={72} color="yellow" /> verdiend
			</p>
			{/* <NextButton dispatch={dispatch} isLastQuestion={isLastQuestion} /> */}
		</div>
	)
}

function getQuestion(dispatch: React.Dispatch<Action>) {
	// fetch('/api/question/3')
	fetch('/api/question/4')
	// fetch("/api/random-question")
		.then((res) => res.json())
		.then((question: Question) => {
			dispatch({ type: Actions.SET_QUESTION, payload: { question } })
		})
}

/**
 * Timer component that counts down from the given time in seconds,
 * the timer is a circle that fills up as time passes, like a hand
 * of a clock. Everything behind the hind is filled in
 */
function Timer({
	dispatch,
	time,
}: {
	time: number
	dispatch: React.Dispatch<Action>
}) {
	const radius = 24
	const stroke = 2
	const circumference = 2 * Math.PI * radius
	const size = (radius + stroke) * 2
	const [elapsed, setElapsed] = useState(0)

	useEffect(() => {
		let frame: number | null = null
		let start: number | null = null

		const animate = (now: number) => {
			if (start === null) start = now
			const seconds = Math.min((now - start) / 1000, time)
			setElapsed(seconds)

			if (seconds < time) {
				frame = requestAnimationFrame(animate)
			} else {
				dispatch({
					type: Actions.TIMED_OUT,
				})
			}
		}

		setElapsed(0)

		if (time > 0) {
			frame = requestAnimationFrame(animate)
		}

		return () => {
			if (frame !== null) cancelAnimationFrame(frame)
		}
	}, [time])

	const progress = time <= 0 ? 1 : Math.min(elapsed / time, 1)
	const remaining = Math.max(Math.ceil(time - elapsed), 0)
	const offset = circumference * (1 - progress)

	return (
		<div
			role="timer"
			aria-live="polite"
			style={{
				position: "relative",
				width: size,
				height: size,
				flexShrink: 0,
			}}
		>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="rgba(255, 255, 255, 0.2)"
						strokeWidth={stroke}
						fill="transparent"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#f9d423"
						strokeWidth={stroke}
						fill="transparent"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						strokeLinecap="round"
					/>
				</g>
			</svg>
			<span
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontVariantNumeric: "tabular-nums",
					fontWeight: 600,
					fontSize: "1.5rem",
					color: "white",
					textShadow: "0 1px 2px rgba(0,0,0,0.4)",
				}}
			>
				{remaining}
			</span>
		</div>
	)
}
