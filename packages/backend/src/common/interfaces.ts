import { QuestionType } from "."

export interface Answer {
	uri: string
	label: string
	hasHint: boolean
}

export interface Question {
	type: QuestionType
	text: string
	choices: Answer[]
	anwser: Answer
}