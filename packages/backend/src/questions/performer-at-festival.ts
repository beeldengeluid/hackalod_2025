import Debug from "debug"
const debug = Debug("lodster:generate:performer-at-festival")

import { Choice, Question, QuestionConfig } from "../common"
import { runGraphDBWebQuery } from "../muziekWeb"
import { PERFORMERS_AT_FESTVAL, PERFORMERS_NOT_AT_FESTVAL, YEARS_FOR_FESTVAL } from "../queries"

export async function generateGuessPerformerAtfFestival(config: QuestionConfig): Promise<Question | undefined> {
	debug("Generating question #3")

	const festivals = [
		"pinkpop",
		"concert-at-sea",
		"dauwpop",
		"dynamo",
		"eurosonic",
		"noorderslag",
		"northseajazz",
		"operadagen",
		"pukkelpop",
		"rabbithole",
		"rewire",
		"roadburn",
		"great-wide-open",
		"oerol",
		"parkpop",
		"simmerdeis",
		"vanderaa",
		"zwarte-cross",
	]
	const randomFestival =
		festivals[Math.floor(Math.random() * festivals.length)]

	// step 1; get active years for a given festival and pick a random one
	const yearTriples = await runGraphDBWebQuery(
		YEARS_FOR_FESTVAL.replace("FESTIVAL_NAME", randomFestival),
	)
	if (yearTriples == null) return
	const years = yearTriples["results"]["bindings"]
	const year_list = years.map((obj) => obj.year.value)
	const randomYear = year_list[Math.floor(Math.random() * year_list.length)]

	debug({ randomFestival, randomYear })

	// step 2 find performers who actually performed there
	const correctPerformers = await runGraphDBWebQuery(
		PERFORMERS_AT_FESTVAL.replace("FESTIVAL_NAME", randomFestival).replace(
			"FESTIVAL_YEAR",
			randomYear,
		),
	)
	if (correctPerformers == null) return

	// step 3 find 1 performer who not performed there in that year
	const incorrectPerformers = await runGraphDBWebQuery(
		PERFORMERS_NOT_AT_FESTVAL.replace(
			"FESTIVAL_NAME",
			randomFestival,
		).replace("FESTIVAL_YEAR", randomYear),
	)
	if (incorrectPerformers == null) return

	const choices = []
	// const answerData = {}
	correctPerformers["results"]["bindings"].forEach((obj) => {
		choices.push({
			uri: obj.uri.value,
			label: obj.label.value,
			hasHint: false,
		})
	})

	const correctAnswer: Choice = {
		uri: incorrectPerformers["results"]["bindings"][0].uri.value,
		label: incorrectPerformers["results"]["bindings"][0].label.value,
		hasHint: false,
	}

	choices.push(correctAnswer)

	return {
		type: config.type,
		text: config.questionText(randomFestival, randomYear),
		choices: choices,
		anwser: correctAnswer,
	}
}