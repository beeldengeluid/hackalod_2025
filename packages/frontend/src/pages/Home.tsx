import { useState, useCallback, useEffect } from "react"
import { Link } from "react-router-dom"

type NameResponse = {
	name: string
}

export function HomePage() {
	const [name, setName] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const loadName = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch("/random-name")

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`)
			}

			const data: NameResponse = await response.json()
			setName(data.name)
		} catch (err) {
			console.error("Failed to fetch random name", err)
			setName(null)
			setError("We could not reach the name generator. Try again?")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		void loadName()
	}, [loadName])

	return (
		<div className="page">
			<div className="backdrop" aria-hidden="true" />
			<main className="card">
				<p className="eyebrow">Hackalod 2025</p>
				<h1 className="headline">
					{isLoading
						? "Finding a name..."
						: name
						? `Hallo, ${name}`
						: "Hallo, mysterious stranger"}
				</h1>
				<p className="lede">Laten we er een mooie HackaLOD van maken!</p>
				{error && (
					<p className="error" role="status">
						{error}
					</p>
				)}
				<div className="actions">
					<button
						className="action"
						type="button"
						onClick={loadName}
						disabled={isLoading}
					>
						{isLoading ? "Aan het genereren" : "Maak er nog een!"}
					</button>
					<Link className="secondary-link" to="/question">
						Bekijk voorbeeldvraag
					</Link>
				</div>
			</main>
		</div>
	)
}