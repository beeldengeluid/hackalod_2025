import Debug from "debug"
const debug = Debug("lodster:generate:track-performer")

import { Choice, Question, QuestionConfig } from "../common"
import { runInternalMuziekWebQuery } from "../muziekWeb"
import { RANDOM_FAMOUS_ALBUM, RANDOM_TRACK_FROM_ALBUM } from "../queries"

//https://graphdb-sandbox.rdlabs.beeldengeluid.nl/sparql?name=Unnamed&query=PREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20xsd%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A%2F%2Fschema.org%2F%3E%0Aprefix%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT%20DISTINCT%20%3Fperformer%20%3FperformerLabel%20(COUNT(*)%20AS%20%3Fcount)%20WHERE%20%7B%0A%20%20%20%20%3Fperformance%20a%20schema%3APerformingArtsEvent%20.%0A%20%20%20%20%3Fperformance%20schema%3Aperformer%20%3Fperformer%20.%0A%09%3Fperformer%20schema%3Aname%20%3FperformerLabel%20.%0A%7D%0AGROUP%20BY%20%3Fperformer%20%3FperformerLabel%0AHAVING%20(%3Fcount%20%3E%202)%0AORDER%20BY%20DESC(%3Fcount)%0ALIMIT%20100&infer=true&sameAs=true
export async function generateGuessTrackPerformer(config: QuestionConfig): Promise<Question | undefined> {
	debug("Generating question #4")
	const personAlbumTriples = await runInternalMuziekWebQuery(
		RANDOM_FAMOUS_ALBUM.replace("100", "100"),
	)
	if (personAlbumTriples == null || personAlbumTriples.length === 0) {
		debug("Could not fetch albums for question generation")
		return
	}
	debug({ personAlbumTriples, RANDOM_FAMOUS_ALBUM })
	const choices: Choice[] = []
	// const unique = []
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

	debug(selectedAlbum)
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
		type: config.type,
		text: config.questionText(),
		choices: finalChoices,
		anwser: finalChoices[0],
		// @ts-ignore
		musicSample: trackTriples[0].embed_url.value,
	}
}