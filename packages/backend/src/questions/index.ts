import { Question, QuestionCase, QuestionType } from "../common/index"
import { generateGuessCorrectBirthYear } from "./correct-birthyear"
import { generateGuessLastPlaceTop2000 } from "./last-place-top-2000"
import { generateGuessPerformerAtfFestival } from "./performer-at-festival"
import { generateGuessThePlaceOfOriginOfABand } from "./place-of-origin-of-band"
import { generateGuessTrackPerformer } from "./track-performer"

export interface QuestionConfig {
	case: QuestionCase
	function: (config: QuestionConfig) => Promise<Question | undefined>
	questionText: (...args: any[]) => string
	type: QuestionType
}

export const questionConfigs: QuestionConfig[] = [
	{
		case: QuestionCase.CorrectBirthYear,
		function: generateGuessCorrectBirthYear,
		questionText: (randomYear: number) => `Welk van deze artiesten is in ${randomYear} geboren?`,
		type: QuestionType.MultipleChoice,
	},
	{
		case: QuestionCase.PerformerAtfFestival,
		function: generateGuessPerformerAtfFestival,
		questionText: (name: string, year: number) => `Welke van deze artiesten speelde NIET op ${name} in ${year}?`,
		type: QuestionType.MultipleChoice,
	},
	{
		case: QuestionCase.TrackPerformer,
		function: generateGuessTrackPerformer,
		questionText: () => `Raad van wie de track is`,
		type: QuestionType.Sample,
	},
	{
		case: QuestionCase.ThePlaceOfOriginOfABand,
		function: generateGuessThePlaceOfOriginOfABand,
		questionText: (name: string) => `Uit welke plaats komt de band ${name}?`,
		type: QuestionType.MultipleChoice,
	},
	{
		case: QuestionCase.LastPlaceTop2000,
		function: generateGuessLastPlaceTop2000,
		questionText: (year: number) => `Wie stond op de laatste plaats in de Top2000 in ${year}?`,
		type: QuestionType.MultipleChoice,
	}
]

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



// function shuffle(array: any[]) {
// 	let currentIndex = array.length

// 	// While there remain elements to shuffle...
// 	while (currentIndex != 0) {
// 		// Pick a remaining element...
// 		let randomIndex = Math.floor(Math.random() * currentIndex)
// 		currentIndex--

// 		// And swap it with the current element.
// 		;[array[currentIndex], array[randomIndex]] = [
// 			array[randomIndex],
// 			array[currentIndex],
// 		]
// 	}
// }