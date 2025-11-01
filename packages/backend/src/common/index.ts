export type { Question, Choice } from "./interfaces"

export enum QuestionType {
	MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
	HITSTER = "HITSTER",
	MAP = "MAP",
	SAMPLE = "SAMPLE",
}

export const questionCases = [1, 3, 4, 5]