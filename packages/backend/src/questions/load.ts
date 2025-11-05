import Debug from "debug"
const debug = Debug("lodster:questions")

import { questionConfigs } from "."
import { type QuestionCase } from "../common"

export async function loadRandomQuestion() {
	const questionCaseIndex = Math.floor(Math.random() * questionConfigs.length)
	return loadQuestion(questionConfigs[questionCaseIndex].case)
}

export async function loadQuestion(questionCase: QuestionCase) {
	const config = questionConfigs.find((qc) => qc.case === questionCase)
	if (!config) return

	debug("Loading question", config)

	return config.function(config)
}