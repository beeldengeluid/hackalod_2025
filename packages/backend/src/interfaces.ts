enum QuestionType {
	MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
	HITSTER = "HITSTER",
	MAP = "MAP",
	SAMPLE = "SAMPLE",
}

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