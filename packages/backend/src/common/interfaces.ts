import { QuestionType } from "."

export interface Choice {
	uri: string
	label: string
	hasHint: boolean
}

export interface Question {
	type: QuestionType
	text: string
	choices: Choice[]
	anwser: Choice
}