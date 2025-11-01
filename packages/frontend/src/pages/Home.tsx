import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"
import { SESSION_STORAGE_KEY } from "../consts"

export function HomePage() {
	const navigate = useNavigate()
	const [name, setName] = useState<string>("")

	return (
		<div className="page">
			<div className="backdrop" aria-hidden="true" />
			<main className="card">
				<p className="eyebrow">Hackalod 2025</p>
				<h1 className="headline">
					Welkom, <input type="text"
						className="name-input"
						placeholder="<naam>"
						value={name}
						onChange={(e) => setName(() => {
							sessionStorage.setItem(SESSION_STORAGE_KEY, e.target.value)
							return e.target.value
						})}
					/>
				</h1>
				<div className="actions">
					<Button
						disabled={name === ""}
						onClick={() => navigate("/question")}
					>
						Naar het spel	
					</Button>
				</div>
			</main>
		</div>
	)
}