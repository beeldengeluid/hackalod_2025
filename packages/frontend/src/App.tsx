import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/Home"
import { QuestionPage } from "./pages/Question"

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/question" element={<QuestionPage />} />
		</Routes>
	)
}
