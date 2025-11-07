import Debug from "debug"
const debug = Debug("lodster:generate:place-of-origin-of-band")

import { Choice, Question, QuestionConfig } from "../common"
import { runGraphDBWebQuery } from "../muziekWeb"
import { runBAGQuery } from "../muziekWeb"
import { BAND_FROM_PLACE, RANDOM_LOCALITIES } from "../queries"
import { getRandomInt } from "../common/utils"

const HARDCODED_LIMIT = 117

export async function generateGuessThePlaceOfOriginOfABand(
	config: QuestionConfig,
): Promise<Question | undefined> {
	debug("Generating question with config", config)

	const correctAnswers = await runGraphDBWebQuery(
		BAND_FROM_PLACE.replace("NUMBER_OFF", getRandomInt(1, HARDCODED_LIMIT).toString()),
	)
	if (correctAnswers == null) return

	const correctAnswer: Choice = {
		uri: correctAnswers["results"]["bindings"][0].location.value,
		label: correctAnswers["results"]["bindings"][0].locationLabel.value,
		hasHint: false,
	}
    const place = correctAnswer.label
	const performer =
    correctAnswers["results"]["bindings"][0].performerName.value
    
	const inCorrectAnswers = await runBAGQuery(
        RANDOM_LOCALITIES.replace("PLACE_NAME", place),
    )
    debug ({ place, inCorrectAnswers })

	if (inCorrectAnswers == null) return
	const choices = []
	inCorrectAnswers.forEach((obj) => {
		choices.push({
			uri: obj.place,
			label: obj.name,
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
