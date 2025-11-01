import Debug from "debug"
const debug = Debug("hackalod:generate")

import {
	LIST_PEOPLE_THAT_LIVED_IN_YEAR,
    LIST_PEOPLE_BORN_IN_YEAR,
    LIST_PEOPLE_NOT_BORN_IN_YEAR,
	LIST_PERONS_INFLUENCED_BY_X,
	LIST_PERSONS,
	LIST_FAMOUS_PERSONS,
	RANDOM_FAMOUS_ALBUM,
	RANDOM_TRACK_FROM_ALBUM,
	YEARS_FOR_FESTVAL,
	PERFORMERS_AT_FESTVAL,
	PERFORMERS_NOT_AT_FESTVAL,
	BAND_FROM_PLACE,
	RANDOM_PLACES,
    LAST_PLACE_TOP2000,
    NOT_LAST_PLACE_TOP2000
} from "./queries"
import {
	runMuziekWebQuery,
	runInternalMuziekWebQuery,
	runGraphDBWebQuery,
} from "./muziekWeb"
import { Question, Choice } from "./common/interfaces"
import { QuestionType } from "./common/index"

export async function generateGuessLastPlaceTop2000() {
	debug("Generating question #6")
    const randomYear = getRandomInt(2000, 2024)

    const correctAnswers = await runGraphDBWebQuery(
		LAST_PLACE_TOP2000.replace("TOP_YEAR", randomYear),
	)
    
    debug({ correctAnswers })
	const correctAnswer: Choice = {
		uri: correctAnswers["results"]["bindings"][0].artist.value,
		label: correctAnswers["results"]["bindings"][0].artistName.value,
		hasHint: false,
	}

	const inCorrectAnswers = await runGraphDBWebQuery(NOT_LAST_PLACE_TOP2000)
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
		type: QuestionType.MULTIPLE_CHOICE,
		text: "Wie stond op de laatste plaats in de Top2000 in TOP_YEAR?".replace(
			"TOP_YEAR",
			randomYear,
		),
		choices: choices,
		anwser: correctAnswer,
	}
}


export async function generateGuessThePlaceOfOriginOfABand() {
	debug("Generating question #5")

	const correctAnswers = await runGraphDBWebQuery(BAND_FROM_PLACE)
	debug({ correctAnswers })
	const correctAnswer: Choice = {
		uri: correctAnswers["results"]["bindings"][0].location.value,
		label: correctAnswers["results"]["bindings"][0].locationLabel.value,
		hasHint: false,
	}
	const performer =
		correctAnswers["results"]["bindings"][0].performerName.value

	const inCorrectAnswers = await runGraphDBWebQuery(RANDOM_PLACES)
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
		type: QuestionType.MULTIPLE_CHOICE,
		text: "Uit welke plaats komt de band BAND_NAME?".replace(
			"BAND_NAME",
			performer,
		),
		choices: choices,
		anwser: correctAnswer,
	}
}

export async function generateGuessPerformerAtfFestival() {
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
	const years = yearTriples["results"]["bindings"]
	const year_list = years.map((obj) => obj.year.value)
	const randomYear = year_list[Math.floor(Math.random() * year_list.length)]

	debug(randomFestival, randomYear)

	// step 2 find performers who actually performed there
	const correctPerformers = await runGraphDBWebQuery(
		PERFORMERS_AT_FESTVAL.replace("FESTIVAL_NAME", randomFestival).replace(
			"FESTIVAL_YEAR",
			randomYear,
		),
	)

	// step 3 find 1 performer who not performed there in that year
	const incorrectPerformers = await runGraphDBWebQuery(
		PERFORMERS_NOT_AT_FESTVAL.replace(
			"FESTIVAL_NAME",
			randomFestival,
		).replace("FESTIVAL_YEAR", randomYear),
	)

	const choices = []
	const answerData = {}
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
		type: QuestionType.MULTIPLE_CHOICE,
		text: "Welke van deze artiesten trad NIET op op FESTIVAL_NAME in FESTIVAL_YEAR?"
			.replace("FESTIVAL_NAME", randomFestival)
			.replace("FESTIVAL_YEAR", randomYear),
		choices: choices,
		anwser: correctAnswer,
	}
}

function getRandomInt(min: number, max: number) {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function shuffle(array: any[]) {
	let currentIndex = array.length

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		]
	}
}

// question 1
export async function generateGuessIncorrectBirthYearQ() {
	debug("Generating question #1")
	const randomYear = getRandomInt(1910, 2000)
    
    const correctAnswers = await runMuziekWebQuery(
        LIST_PEOPLE_BORN_IN_YEAR.replace("1970", randomYear + ""),
    )

	const inCorrectAnswers = await runMuziekWebQuery(
		LIST_PEOPLE_NOT_BORN_IN_YEAR.replace("1970", randomYear + ""),
	)

	debug ({ correctAnswers })
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
		type: QuestionType.MULTIPLE_CHOICE,
		text:
			"Raad welke van deze artiesten niet in " + randomYear + " geboren is",
		choices: choices,
		anwser: correctAnswer,
	}
}

// question 4
//https://graphdb-sandbox.rdlabs.beeldengeluid.nl/sparql?name=Unnamed&query=PREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A%2F%2Fschema.org%2F%3E%0Aprefix%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT%20DISTINCT%20%3Fperformer%20%3FperformerLabel%20(COUNT(*)%20AS%20%3Fcount)%20WHERE%20%7B%0A%20%20%20%20%3Fperformance%20a%20schema%3APerformingArtsEvent%20.%0A%20%20%20%20%3Fperformance%20schema%3Aperformer%20%3Fperformer%20.%0A%09%3Fperformer%20schema%3Aname%20%3FperformerLabel%20.%0A%7D%0AGROUP%20BY%20%3Fperformer%20%3FperformerLabel%0AHAVING%20(%3Fcount%20%3E%202)%0AORDER%20BY%20DESC(%3Fcount)%0ALIMIT%20100&infer=true&sameAs=true
export async function generateGuessTrackPerformer() {
	debug("Generating question #4")
	const personAlbumTriples = await runInternalMuziekWebQuery(
		RANDOM_FAMOUS_ALBUM.replace("100", "100"),
	)
	if (personAlbumTriples == null || personAlbumTriples.length === 0) {
		debug("Could not fetch albums for question generation")
		return
	}
	debug(RANDOM_FAMOUS_ALBUM)
	debug("ALBUMS")
	debug(personAlbumTriples)
	const choices: Choice[] = []
	const unique = []
	let selectedAlbum: string | undefined
	personAlbumTriples.forEach((album) => {
		if (!selectedAlbum) {
			selectedAlbum = album.album.value
		}
		let check = choices.some((el) => el.uri === album.person.value)
		if (!check) {
			choices.push({
				uri: album.person.value,
				label: album.person_name.value,
				hasHint: false,
			})
		}
	})

	debug("Selected album " + selectedAlbum)
	const trackQuery = RANDOM_TRACK_FROM_ALBUM.replace(
		"FAMOUS_ALBUM",
		selectedAlbum ?? "",
	)
	const trackTriples = await runInternalMuziekWebQuery(trackQuery)
	debug(trackQuery)
	debug("TRACKS")
	debug(trackTriples)

	if (trackTriples == null || trackTriples.length === 0) {
		debug("Could not fetch tracks for question generation")
		return
	}

	const finalChoices = choices.slice(0, 4)
	return {
		type: QuestionType.MULTIPLE_CHOICE,
		text: `Raad van wie de track is`,
		choices: finalChoices,
		anwser: finalChoices[0],
		musicSample: trackTriples[0].embed_url.value,
	}
}

export async function loadQuestion(num: number) {
	debug("Loading question #" + num)
	let question: Question | null = null
	switch (num) {
		case 1:
			question = generateGuessIncorrectBirthYearQ()
			break
		case 3:
			question = generateGuessPerformerAtfFestival()
			break
		case 4:
			question = generateGuessTrackPerformer()
			break
		case 5:
			question = generateGuessThePlaceOfOriginOfABand()
        break
        case 6:
			question = generateGuessLastPlaceTop2000()
			break
	}
	return question
}

/*
// question 2
//https://graphdb-sandbox.rdlabs.beeldengeluid.nl/sparql?name=Unnamed&query=PREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A%2F%2Fschema.org%2F%3E%0Aprefix%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT%20DISTINCT%20%3Fperformer%20%3FperformerLabel%20(COUNT(*)%20AS%20%3Fcount)%20WHERE%20%7B%0A%20%20%20%20%3Fperformance%20a%20schema%3APerformingArtsEvent%20.%0A%20%20%20%20%3Fperformance%20schema%3Aperformer%20%3Fperformer%20.%0A%09%3Fperformer%20schema%3Aname%20%3FperformerLabel%20.%0A%7D%0AGROUP%20BY%20%3Fperformer%20%3FperformerLabel%0AHAVING%20(%3Fcount%20%3E%202)%0AORDER%20BY%20DESC(%3Fcount)%0ALIMIT%20100&infer=true&sameAs=true
export async function generateGuessCorrectInfluence() {
    console.log("Generating question #2");
    const personTriples = await runMuziekWebQuery(LIST_FAMOUS_PERSONS.replace("100", "4")); // one random person
    let randomPerson = personTriples ? personTriples[0] : {
        uri: "https://data.muziekweb.nl/Link/M00000071922",
        label: "Queen"
    }

    const choices: Answer[] = [];
    personTriples.forEach(person => {
        choices.push({
            uri: person.uri,
            label: person.label,
            hasHint: false
        })  
    })

    const q = LIST_PERONS_INFLUENCED_BY_X.replace("PERSON_URI", "<" + randomPerson.uri + ">")
    console.log(q)
    const correctInfluences = await runMuziekWebQuery(q);
    console.log(correctInfluences);
    const answerData = correctInfluences ? correctInfluences[0] : null;

    if(!answerData) {
        return {error : "Question could not be generated for person"}
    }

    // TODO fetch 1st result as answer
    const correctAnswer:Answer = {
        uri: answerData.uri,
	    label: answerData.label,
	    hasHint: false
    } 

    choices[4] = correctAnswer;

    return {
        type: QuestionType.MULTIPLE_CHOICE,
        text: `Raad wie ${randomPerson.label} heeft beinvloed op muzikaal vlak`,
    	choices: choices,
	    anwser: correctAnswer,

    };

    
}*/
