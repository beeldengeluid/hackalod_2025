import {LIST_PEOPLE_THAT_LIVED_IN_YEAR, LIST_PERONS_INFLUENCED_BY_X, LIST_PERSONS} from "./queries"
import {runMuziekWebQuery} from "./muziekWeb"
import {Question , Answer} from "./common/interfaces"
import { QuestionType } from "./common/index"

export async function generateGuessIncorrectBirthYearQ() {
    console.log("Generating question #1");
    const randomYear = 1980; //TODO make this actually random 
    const randomIncorrectYear = 1992;

    const incorrectTriples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR.replace("1970", randomIncorrectYear + ""));
    //console.log(incorrectTriples);
    const answerData = incorrectTriples ? incorrectTriples[0] : null;

    // TODO fetch 1st result as answer
    const correctAnswer:Answer = {
        uri: answerData.uri,
	    label: answerData.label,
	    hasHint: false
    } 
    //console.log(correctAnswer);
    const correctTriples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR.replace("1970", randomYear + ""));
    //console.log(correctTriples[0]);
    const choices: Answer[] = [];
    for(let i=0;i<3; i++) {
        let choiceData = correctTriples[i];
        choices.push({
            uri: choiceData.uri,
            label: choiceData.label,
            hasHint: false
        })  
    }
    choices.push(correctAnswer);

    return {
        type: QuestionType.MULTIPLE_CHOICE,
        text: "Raadt welke van deze artiesten niet in " + randomYear + " geboren is",
    	choices: choices,
	    anwser: correctAnswer,

    };
}

export async function generateGuessCorrectInfluence() {
    console.log("Generating question #2");
    const personTriples = await runMuziekWebQuery(LIST_PERSONS.replace("100", "4")); // one random person
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

    const correctInfluences = await runMuziekWebQuery(LIST_PERONS_INFLUENCED_BY_X.replace("PERSON_URI", randomPerson.uri));
    //console.log(correctInfluences);
    const answerData = correctInfluences ? correctInfluences[0] : null;

    // TODO fetch 1st result as answer
    const correctAnswer:Answer = {
        uri: answerData.person,
	    label: answerData.name,
	    hasHint: false
    } 

    choices[4] = correctAnswer;

    return {
        type: QuestionType.MULTIPLE_CHOICE,
        text: `Raadt wie ${randomPerson.label} heeft beinvloed op muzikaal vlak`,
    	choices: choices,
	    anwser: correctAnswer,

    };

    
}