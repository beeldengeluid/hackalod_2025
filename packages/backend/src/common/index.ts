export type { Question, Choice } from "./interfaces"

export enum QuestionType {
	MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
	HITSTER = "HITSTER",
	MAP = "MAP",
	SAMPLE = "SAMPLE",
}

export const questionCases = [3, 4, 5, 6]