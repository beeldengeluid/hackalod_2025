import {LIST_PEOPLE_THAT_LIVED_IN_YEAR} from "./queries"
import {runMuziekWebQuery} from "./muziekWeb"
import {Question, QuestionType, Answer} from "./interfaces"

export async function generateGuessIncorrectBirthYearQ() {
    console.log("Generating question #1");
    const randomYear = 1980; //TODO make this actually random 
    const randomIncorrectYear = 1992;

    const incorrectTriples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR.replace("1970", randomIncorrectYear + ""));
    //console.log(incorrectTriples);
    const answerData = incorrectTriples ? incorrectTriples[0] : null;

    // TODO fetch 1st result as answer
    const correctAnswer:Answer = {
        uri: answerData.person,
	    label: answerData.name,
	    hasHint: false
    } 
    //console.log(correctAnswer);
    const correctTriples = await runMuziekWebQuery(LIST_PEOPLE_THAT_LIVED_IN_YEAR.replace("1970", randomYear + ""));
    //console.log(correctTriples[0]);
    const choices: Answer[] = [];
    for(let i=0;i<3; i++) {
        let choiceData = correctTriples[i];
        choices.push({
            uri: choiceData.person,
            label: choiceData.name,
            hasHint: false
        })  
    }
    choices.push(correctAnswer);

    let question: Question = {
        type: QuestionType.MULTIPLE_CHOICE,
        text: "Raadt welke van deze artiesten niet in " + randomYear + " geboren is",
    	choices: choices,
	    anwser: correctAnswer,

    };
    console.log("Should be ok");
    return question;
}

