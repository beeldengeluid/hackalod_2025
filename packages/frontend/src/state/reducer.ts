import { AnswerStatus, State } from "."
import { Action, Actions } from "./actions"

export function reducer(state: State, action: Action): State {
	if (process.env.NODE_ENV === "development")
		console.log("[REDUCER]", action)

	let nextState = state

	switch (action.type) {
		case Actions.ANSWER: {
			const status = action.payload.choice.uri === state.question?.anwser.uri
				? AnswerStatus.Correct
				: AnswerStatus.Incorrect

			const score = status === AnswerStatus.Correct
				? state.score + 1
				: state.score

			nextState = {
				...state,
				status,
				score
			}

			break
		}

		case Actions.SET_QUESTION: {
			const status = state.current === state.total
				? AnswerStatus.Done
				: AnswerStatus.Unanswered

			let current = status === AnswerStatus.Unanswered
				? state.current + 1
				: state.current

			/** if statement to prevent strictMode from increment too fast */
			if (state.status !== AnswerStatus.Unanswered) {
				nextState = {
					...state,
					question: action.payload.question,
					status,
					current
				}
			}

			break
		}

		case Actions.TIMED_OUT: {
			nextState = {
				...state,
				status: AnswerStatus.TimedOut
			}
			break
		}
	}

	return nextState
}
