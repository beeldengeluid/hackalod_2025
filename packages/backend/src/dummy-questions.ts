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
	text: "Welke artiest zong het nummer 'Bohemian Rhapsody'?",
	choices: [
		{ uri: "urn:artist:queen", label: "Queen", hasHint: false },
		{ uri: "urn:artist:beatles", label: "The Beatles", hasHint: false },
		{ uri: "urn:artist:pinkfloyd", label: "Pink Floyd", hasHint: true },
		{
			uri: "urn:artist:rollingstones",
			label: "The Rolling Stones",
			hasHint: false,
		},
	],
	anwser: { uri: "urn:artist:queen", label: "Queen", hasHint: false },
}

const question3: Question = {
	type: QuestionType.MULTIPLE_CHOICE,
	text: "Welke planeet staat bekend als de 'Rode Planeet'?",
	choices: [
		{ uri: "urn:planet:mars", label: "Mars", hasHint: false },
		{ uri: "urn:planet:venus", label: "Venus", hasHint: false },
		{ uri: "urn:planet:jupiter", label: "Jupiter", hasHint: true },
		{ uri: "urn:planet:saturnus", label: "Saturnus", hasHint: false },
	],
	anwser: { uri: "urn:planet:mars", label: "Mars", hasHint: false },
}

const question4: Question = {
	type: QuestionType.MULTIPLE_CHOICE,
	text: "Wie schilderde de Mona Lisa?",
	choices: [
		{
			uri: "urn:artist:leonardo",
			label: "Leonardo da Vinci",
			hasHint: false,
		},
		{ uri: "urn:artist:michelangelo", label: "Michelangelo", hasHint: false },
		{ uri: "urn:artist:raphael", label: "Raphael", hasHint: true },
		{ uri: "urn:artist:davinci", label: "Donatello", hasHint: false },
	],
	anwser: {
		uri: "urn:artist:leonardo",
		label: "Leonardo da Vinci",
		hasHint: false,
	},
}

const question5: Question = {
	type: QuestionType.MULTIPLE_CHOICE,
	text: "Wat is de grootste oceaan ter wereld?",
	choices: [
		{ uri: "urn:ocean:pacific", label: "Stille Oceaan", hasHint: false },
		{
			uri: "urn:ocean:atlantic",
			label: "Atlantische Oceaan",
			hasHint: false,
		},
		{ uri: "urn:ocean:indian", label: "Indische Oceaan", hasHint: true },
		{ uri: "urn:ocean:arctic", label: "Arctische Oceaan", hasHint: false },
	],
	anwser: { uri: "urn:ocean:pacific", label: "Stille Oceaan", hasHint: false },
}

const question6: Question = {
	type: QuestionType.MULTIPLE_CHOICE,
	text: "Welke taal wordt gesproken in Brazilië?",
	choices: [
		{ uri: "urn:language:portuguese", label: "Portugees", hasHint: false },
		{ uri: "urn:language:spanish", label: "Spaans", hasHint: false },
		{ uri: "urn:language:french", label: "Frans", hasHint: true },
		{ uri: "urn:language:english", label: "Engels", hasHint: false },
	],
	anwser: {
		uri: "urn:language:portuguese",
		label: "Portugees",
		hasHint: false,
	},
}

export const dummyQuestions: Question[] = [
	question1,
	question2,
	question3,
	question4,
	question5,
	question6,
]
