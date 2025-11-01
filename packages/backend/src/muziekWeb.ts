import Debug from 'debug'
const debug = Debug("hackalod:muziekweb")

import { GraphDBResponse } from "./common/interfaces"

const SPARQL_URL =
	"https://data.muziekweb.nl/_api/datasets/MuziekwebOrganization/Muziekweb/services/Muziekweb/sparql"

const DUMMY_QUERY = { query: "select * where {?subj ?pred ?obj.} limit 10" }

const TRACKS_QUERY_URL =
	"https://sandbox-search.rdlabs.beeldengeluid.nl/api/v1.1/lod/grlc/beeldengeluid/sparql-queries/getMuziekAlbumTracks/"

const WM_INTERNAL_QUERY_URL =
	"https://sandbox-search.rdlabs.beeldengeluid.nl/api/v1.1/lod/sparql-direct"
const DUMMY_TRACK_QUERY = {
	endpoint: "MUZIEKWEB_INTERNAL",
	parameters: [
		{
			key: "album",
			value: "https://data.muziekweb.nl/Link/JE44551",
		},
	],
}

const DUMMY_MW_INTERNAL_QUERY = {
	endpoint: "MUZIEKWEB_INTERNAL",
	query: "SELECT * WHERE { ?s ?p ?o } LIMIT 10",
}

export async function runMuziekWebQuery(query: string) {
	debug(query)
	try {
		const response = await fetch(SPARQL_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query: query }),
		})
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const result = await response.json()
		//console.log(result);
		return result
	} catch (error: any) {
		console.error("He getsie een error: " + error.message)
		console.error(error)
	}
	return []
}

//FIXME graphdb works a bit differently
export async function runGraphDBWebQuery(query: string) {
	try {
		const response = await fetch(
			"https://graphdb-sandbox.rdlabs.beeldengeluid.nl/repositories/hackalod-imagine",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/sparql-query",
					Accept: "application/sparql-results+json",
				},
				body: query,
			},
		)
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const result = (await response.json()) as GraphDBResponse
		return result
	} catch (error: any) {
		console.error("He getsie een error: " + error.message)
		console.error(error)
	}
}

interface InternalMuziekWebQueryResponse {
	person: {
		type: 'uri'
		value: string
	},
	person_name: {
		type: 'literal'
		value: string
	},
	album: {
		type: 'uri'
		value: string
	}
}
export async function runInternalMuziekWebQuery(query: string) {
	try {
		const response = await fetch(WM_INTERNAL_QUERY_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Basic aGFja2Fsb2RfMjAyNTpIQUNLLWxvb2Z0LTReX19ebWFhay1lci1XYXQtdmFu",
			},
			body: JSON.stringify({ endpoint: "MUZIEKWEB_INTERNAL", query }),
		})
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const result = (await response.json()) as { result: GraphDBResponse }[]
		debug(result)
		return result[0].result.results.bindings as unknown as InternalMuziekWebQueryResponse[]
	} catch (error: any) {
		console.error("He getsie een error: " + error.message)
	}
}

export async function getAlbumTracks(albumId: string) {
	debug("Getting album tracks for: " + albumId)
	const payload = {
		endpoint: "MUZIEKWEB_INTERNAL",
		parameters: [
			{
				key: "album",
				value: "https://data.muziekweb.nl/Link/" + albumId,
			},
		],
	}
	try {
		const response = await fetch(TRACKS_QUERY_URL, {
			//  + "?refreshCache=False"
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Basic aGFja2Fsb2RfMjAyNTpIQUNLLWxvb2Z0LTReX19ebWFhay1lci1XYXQtdmFu",
			},
			body: JSON.stringify(payload),
		})
		debug(response)
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const result = await response.json()
		debug(result)
		return result
	} catch (error: any) {
		console.error("He getsie een error: " + error.message)
	}
	return null
}
