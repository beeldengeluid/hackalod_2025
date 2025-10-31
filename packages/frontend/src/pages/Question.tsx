import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import clsx from "clsx"
import { type Question } from "@hackalod2025/common"

import styles from "./Question.module.css"

export function QuestionPage() {
	const sampleQuestion = useQuestion();

	if (!sampleQuestion) return null

	return (
		<div className="page">
			<div className="backdrop" aria-hidden="true" />
			<main className={clsx(styles.card)}>
				<p className="eyebrow">Vraagvoorbeeld</p>
				<h1 className="headline">{sampleQuestion.text}</h1>
				<p className="lede">Ik weet niet wat dit is</p>
				<ul className="step-list">
					{sampleQuestion.choices.map((choice) => (
						<li key={choice.uri}>{choice.label}</li>
					))}
				</ul>
				<Link className="action" to="/">
					Terug naar start
				</Link>
			</main>
		</div>
	)
}

function useQuestion() {
	const [question, setQuestion] = useState<Question>()
	fetch("/api/random-question")
		.then((res) => res.json())
		.then(setQuestion);

	return question
}