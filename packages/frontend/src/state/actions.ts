import { Choice, Question } from "../../../backend/src/common"

export enum Actions {
	ANSWER = "ANSWER",
	RESET = "RESET",
	SET_QUESTION = "SET_QUESTION",
	TIMED_OUT = "TIMED_OUT",
}

export type Action =
	| {
			type: Actions.ANSWER
			payload: {
				choice: Choice
			}
	  }
	| {
			type: Actions.SET_QUESTION
			payload: {
				question: Question | undefined
			}
	  }
	| {
			type: Actions.TIMED_OUT
	  }
	| {
			type: Actions.RESET
	}
