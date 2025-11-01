import { useState, useEffect, useContext } from "react"
import { type Choice } from "@hackalod2025/common"

import { DispatchContext } from "../../state"
import { Actions } from "../../state/actions"

import styles from "./Choice.module.css"

export function Choice({ choice }: { choice: Choice }) {
	const dispatch = useContext(DispatchContext)
	const picture = useWikiDataPicture(choice.label)

	return (
		<li
			className={styles.choice}
			onClick={() => dispatch({ type: Actions.ANSWER, payload: { choice } })}
		>
			<span className={styles.checkboxText}>{choice.label}</span>
			{picture && (
				<img
					src={picture}
					alt={choice.label}
					className={styles.choiceImage}
					loading="lazy"
				/>
			)}
		</li>
	)
}

function useWikiDataPicture(searchString: string) {
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	useEffect(() => {
		const query = `
			PREFIX wd: <http://www.wikidata.org/entity/>
			PREFIX wdt: <http://www.wikidata.org/prop/direct/>
			PREFIX wikibase: <http://wikiba.se/ontology#>
			PREFIX bd: <http://www.bigdata.com/rdf#>
			PREFIX mwapi: <https://www.mediawiki.org/ontology#API/>

			SELECT ?item ?itemLabel ?image WHERE {
			SERVICE wikibase:mwapi {
				bd:serviceParam wikibase:endpoint "www.wikidata.org" ;
									wikibase:api "EntitySearch" ;
									mwapi:search "${searchString}" ;
									mwapi:language "en" .
				?item wikibase:apiOutputItem mwapi:item .
			}
			OPTIONAL { ?item wdt:P18 ?image. }
			SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
			}
			LIMIT 1
		`
		const url = new URL("https://query.wikidata.org/sparql")
		url.search = new URLSearchParams({
			query,
			format: "json",
		}).toString()

		fetch(url.toString(), {
			headers: {
				Accept: "application/sparql-results+json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				const bindings = data?.results?.bindings ?? []
				const image = bindings[0]?.image?.value
				if (image) {
					setImageUrl("/api/image/" + encodeURIComponent(image))
				}
			})
			.catch(() => setImageUrl(null))
	}, [])

	return imageUrl
}
