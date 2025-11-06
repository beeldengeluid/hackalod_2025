import Debug from "debug"
const debug = Debug("lodster:generate:correct-birthyear")

import { QuestionConfig, Question, Choice } from "../common"
import { runMuziekWebQuery } from "../muziekWeb"
import { LIST_PEOPLE_BORN_IN_YEAR, LIST_PEOPLE_NOT_BORN_IN_YEAR } from "../queries"
import { getRandomInt } from "../common/utils"

export async function generateGuessCorrectBirthYear(config: QuestionConfig): Promise<Question | undefined> {
	debug("Generating question with config: ", config)

	const randomYear = getRandomInt(1910, 2000)

	const correctAnswers = await runMuziekWebQuery(
		LIST_PEOPLE_BORN_IN_YEAR.replace("1970", randomYear + ""),
	)

	const inCorrectAnswers = await runMuziekWebQuery(
		LIST_PEOPLE_NOT_BORN_IN_YEAR.replace("1970", randomYear + ""),
	)

	debug({ correctAnswers })
	const correctAnswer: Choice = {
		uri: correctAnswers[0].uri,
		label: correctAnswers[0].label,
		hasHint: false,
	}

	const choices = []
	inCorrectAnswers.forEach((obj) => {
		choices.push({
			uri: obj.uri,
			label: obj.label,
			hasHint: false,
		})
	})
	choices.push(correctAnswer)

	return {
		type: config.type,
		text: config.questionText(randomYear),
		choices: choices,
		anwser: correctAnswer,
	}
}