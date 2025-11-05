import { createContext, Dispatch } from "react"
import type { Action } from "./actions"
import { type Choice, type Question } from "@lodster/common"
import { QUESTION_COUNT } from "../consts"

export enum AnswerStatus {
	Correct = "correct",
	Done = "done",
	Incorrect = "incorrect",
	Loading = "loading",
	TimedOut = "timed_out",
	Unanswered = "unanswered",
	Unset = "unset",
}

// Define the shape of the state
export interface State {
	anwser: Choice | undefined
	current: number /* Current question number the player is on */
	question: Question | undefined /* The current question to be answered */
	score: number /* The player's current score */
	status: AnswerStatus /* The status of the current question */
	total: number /* Total number of questions the player has to answer */
}

// Define the initial state
export const initialState: State = {
	anwser: undefined,
	current: 0,
	question: undefined,
	score: 0,
	status: AnswerStatus.Unset,
	total: QUESTION_COUNT,
}

// Create the contexts
export const StateContext = createContext<State>(initialState)
export const DispatchContext = createContext<Dispatch<Action>>(() => {})
