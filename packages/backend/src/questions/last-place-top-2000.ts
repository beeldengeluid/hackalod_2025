import Debug from "debug"
const debug = Debug("lodster:generate:last-place-top-2000")

import { Choice, Question, QuestionConfig } from "../common"
import { getRandomInt } from "../common/utils"
import { runGraphDBWebQuery } from "../muziekWeb"
import { LAST_PLACE_TOP2000, NOT_LAST_PLACE_TOP2000 } from "../queries"


export async function generateGuessLastPlaceTop2000(config: QuestionConfig): Promise<Question | undefined> {
	debug("Generating question #6")
	const randomYear = getRandomInt(2000, 2024)

	const correctAnswers = await runGraphDBWebQuery(
		LAST_PLACE_TOP2000.replace("TOP_YEAR", randomYear.toString()),
	)
	if (correctAnswers == null) return

	debug({ correctAnswers })
	const correctAnswer: Choice = {
		uri: correctAnswers["results"]["bindings"][0].artist.value,
		label: correctAnswers["results"]["bindings"][0].artistName.value,
		hasHint: false,
	}

	const inCorrectAnswers = await runGraphDBWebQuery(NOT_LAST_PLACE_TOP2000)
	if (inCorrectAnswers == null) return

	const choices = []
	inCorrectAnswers["results"]["bindings"].forEach((obj) => {
		choices.push({
			uri: obj.artist.value,
			label: obj.artistName.value,
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