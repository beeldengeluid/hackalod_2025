import { useState, useEffect, useContext, type MouseEvent } from "react"
import { type Choice } from "@hackalod2025/common"

import { DispatchContext } from "../../state"
import { Actions } from "../../state/actions"

import styles from "./Choice.module.css"

export function Choice({ choice }: { choice: Choice }) {
	const dispatch = useContext(DispatchContext)
	const asset = useWikiDataPicture(choice.label)
	const picture = asset?.imageUrl ?? null
	const wikidataUrl = asset?.entityUrl ?? null
	const [isPopupOpen, setIsPopupOpen] = useState(false)

	useEffect(() => {
		setIsPopupOpen(false)
	}, [choice.label])

	const handleImageClick = (event: MouseEvent<HTMLImageElement>) => {
		event.stopPropagation()
		setIsPopupOpen(true)
	}

	const handlePopupClick = (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
		event.stopPropagation()
	}

	return (
		<li
			className={styles.choice}
			onClick={() => dispatch({ type: Actions.ANSWER, payload: { choice } })}
		>
			<span className={styles.checkboxText}>{choice.label}</span>
			{picture && (
				<div className={styles.imageWrapper} onClick={(event) => event.stopPropagation()}>
					<img
						src={picture}
						alt={choice.label}
						className={styles.choiceImage}
						loading="lazy"
						onClick={handleImageClick}
					/>
					{isPopupOpen && wikidataUrl && (
						<div
							className={styles.imagePopup}
							role="dialog"
							aria-modal="true"
							aria-label={`${choice.label} information`}
							onClick={handlePopupClick}
						>
							<a
								href={wikidataUrl}
								target="_blank"
								rel="noreferrer"
								className={styles.imagePopupLink}
							>
								Bewerken op Wikidata
							</a>
							<button
								type="button"
								className={styles.popupClose}
								onClick={(event) => {
									handlePopupClick(event)
									setIsPopupOpen(false)
								}}
								aria-label="Close"
							>
								×
							</button>
						</div>
					)}
				</div>
			)}
		</li>
	)
}

type WikiDataAsset = {
	imageUrl: string
	entityUrl: string
}

function useWikiDataPicture(searchString: string) {
	const [asset, setAsset] = useState<WikiDataAsset | null>(null)

	useEffect(() => {
		setAsset(null)
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
				const item = bindings[0]?.item?.value
				if (image && item) {
					setAsset({
						imageUrl: "/api/image/" + encodeURIComponent(image),
						entityUrl: item,
					})
				}
			})
			.catch(() => setAsset(null))
	}, [searchString])

	return asset
}
