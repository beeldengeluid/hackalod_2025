import Debug from "debug"
const debug = Debug("lodster:generate:place-of-origin-of-band")

import { Choice, Question, QuestionConfig } from "../common"
import { runGraphDBWebQuery } from "../muziekWeb"
import { BAND_FROM_PLACE, RANDOM_PLACES } from "../queries"


export async function generateGuessThePlaceOfOriginOfABand(config: QuestionConfig): Promise<Question | undefined> {
	debug("Generating question with config", config)

	const correctAnswers = await runGraphDBWebQuery(BAND_FROM_PLACE)
	if (correctAnswers == null) return
	debug({ correctAnswers })
	const correctAnswer: Choice = {
		uri: correctAnswers["results"]["bindings"][0].location.value,
		label: correctAnswers["results"]["bindings"][0].locationLabel.value,
		hasHint: false,
	}
	const performer =
		correctAnswers["results"]["bindings"][0].performerName.value

	const inCorrectAnswers = await runGraphDBWebQuery(RANDOM_PLACES)
	if (inCorrectAnswers == null) return
	const choices = []
	inCorrectAnswers["results"]["bindings"].forEach((obj) => {
		choices.push({
			uri: obj.uri.value,
			label: obj.label.value,
			hasHint: false,
		})
	})
	choices.push(correctAnswer)

	return {
		type: config.type,
		text: config.questionText(performer),
		choices: choices,
		anwser: correctAnswer,
	}
}