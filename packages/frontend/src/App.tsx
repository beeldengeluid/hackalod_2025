import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/Home"
import { QuestionPage } from "./pages/Question"
import { DispatchContext, initialState, StateContext } from "./state"
import { reducer } from "./state/reducer"
import { useReducer } from "react"

export default function App() {
	const [state, dispatch] = useReducer(reducer, initialState)

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/question" element={<QuestionPage />} />
				</Routes>
			</StateContext.Provider>
		</DispatchContext.Provider>
	)
}
