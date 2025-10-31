import { QuestionType } from "./common"
import { Question } from "./common/interfaces"

const question1: Question = {
	type: QuestionType.MULTIPLE_CHOICE,
	text: "Wat is de hoofdstad van Nederland?",
	choices: [
		{ uri: "urn:city:amsterdam", label: "Amsterdam", hasHint: false },
		{ uri: "urn:city:rotterdam", label: "Rotterdam", hasHint: false },
		{ uri: "urn:city:utrecht", label: "Utrecht", hasHint: true },
		{ uri: "urn:city:eindhoven", label: "Eindhoven", hasHint: false },
	],
	anwser: { uri: "urn:city:amsterdam", label: "Amsterdam", hasHint: false },
}

const question2: Question = {
	type: QuestionType.MULTIPLE_CHOICE,
	text: "Welke artiest heeft het nummer 'Bohemian Rhapsody' gezongen?",
	choices: [
		{ uri: "urn:artist:queen", label: "Queen", hasHint: false },
		{ uri: "urn:artist:beatles", label: "The Beatles", hasHint: false },
		{ uri: "urn:artist:pinkfloyd", label: "Pink Floyd", hasHint: true },
		{ uri: "urn:artist:rollingstones", label: "The Rolling Stones", hasHint: false },
	],
	anwser: { uri: "urn:artist:queen", label: "Queen", hasHint: false },
}

export const dummyQuestions: Question[] = [question1, question2]
