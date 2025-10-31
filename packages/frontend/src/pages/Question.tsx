import { useMemo } from "react"
import { Link } from "react-router-dom"
import clsx from "clsx"

import styles from "./Question.module.css"

export function QuestionPage() {
	const sampleQuestion = useMemo(
		() => ({
			title: "Voorbeeldvraag",
			prompt:
				"Plaats het nummer 'Bohemian Rhapsody' in de juiste volgorde van releasejaren.",
			steps: [
				"Klik en sleep de kaartjes op de tijdlijn.",
				"Controleer of je positie klopt en bevestig.",
				"Verdien bonuspunten door aanvullende weetjes goed te raden.",
			],
		}),
		[],
	)

	return (
		<div className="page">
			<div className="backdrop" aria-hidden="true" />
			<main className={clsx(styles.card)}>
				<p className="eyebrow">Vraagvoorbeeld</p>
				<h1 className="headline">{sampleQuestion.title}</h1>
				<p className="lede">{sampleQuestion.prompt}</p>
				<ul className="step-list">
					{sampleQuestion.steps.map((step) => (
						<li key={step}>{step}</li>
					))}
				</ul>
				<Link className="action" to="/">
					Terug naar start
				</Link>
			</main>
		</div>
	)
}