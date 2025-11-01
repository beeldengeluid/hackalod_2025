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
	musicSample: string| null
}

export interface GraphDBResponse {
	head: {
		vars: string[]
	}
	results: {
		bindings: Array<{
			[key: string]: {
				type: string
				value: string
			}
		}>
	}
}