import type { Question } from "./interfaces"
export type { Question, Choice } from "./interfaces"

export enum QuestionCase {
	IncorrectBirthYear,
	PerformerAtfFestival,
	TrackPerformer,
	ThePlaceOfOriginOfABand,
	LastPlaceTop2000,
}

export enum QuestionType {
	MultipleChoice = "MULTIPLE_CHOICE",
	Sample = "SAMPLE",
}

export interface QuestionConfig {
	case: QuestionCase
	function: (config: QuestionConfig) => Promise<Question | undefined>
	questionText: (...args: any[]) => string
	type: QuestionType
}
