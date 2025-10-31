import {LIST_PEOPLE_THAT_LIVED_IN_YEAR} from "./queries"
import {runMuziekWebQuery} from "./muziekWeb"
import {Question, QuestionType, Answer} from "./interfaces"

export async function generateGuessIncorrectBirthYearQ() {
    const randomYear = 1980; //TODO make this actually random 
    const randomIncorrectYear = 1982;

    const incorrectTriples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR.replace("1970", randomIncorrectYear + ""));

    // TODO fetch 1st result as answer
    const correctAnswer:Answer = {
        uri: "",
	    label: "",
	    hasHint: false
    } 

    const correctTriples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR.replace("1970", randomYear + ""));

    let question: Question = {
        type: QuestionType.MULTIPLE_CHOICE,
        text: "Raadt welke van deze artiesten niet uit ",
    	choices: [],
	    anwser: correctAnswer,

    };

    

    return null;
}

