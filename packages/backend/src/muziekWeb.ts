const SPARQL_URL = "https://data.muziekweb.nl/_api/datasets/MuziekwebOrganization/Muziekweb/services/Muziekweb/sparql";
const DUMMY_QUERY = {"query":"select * where {?subj ?pred ?obj.} limit 10"};
const TRACKS_QUERY_URL = "https://sandbox-search.rdlabs.beeldengeluid.nl/api/v1.1/lod/grlc/beeldengeluid/sparql-queries/getMuziekAlbumTracks/"
const WM_INTERNAL_QUERY_URL = "https://sandbox-search.rdlabs.beeldengeluid.nl/api/v1.1/lod/sparql-direct"
const DUMMY_TRACK_QUERY = {
  "endpoint": "MUZIEKWEB_INTERNAL",
  "parameters": [
    {
      "key": "album",
      "value": "https://data.muziekweb.nl/Link/JE44551"
    }
  ]
}

const DUMMY_MW_INTERNAL_QUERY = {
  "endpoint": "MUZIEKWEB_INTERNAL",
  "query": "SELECT * WHERE { ?s ?p ?o } LIMIT 10"
}


export async function getSomeTriplesFromMuziekWeb() {
  try {
    const response = await fetch(SPARQL_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(DUMMY_QUERY),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result
  } catch (error) {
    console.error("He getsie een error: " + error.message);
  }
  return null;
}

export async function getSomeTriplesFromMuziekWebInternal() {
  try {
    const response = await fetch(WM_INTERNAL_QUERY_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization" : "Basic aGFja2Fsb2RfMjAyNTpIQUNLLWxvb2Z0LTReX19ebWFhay1lci1XYXQtdmFu"
    },
    body: JSON.stringify(DUMMY_MW_INTERNAL_QUERY),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result
  } catch (error) {
    console.error("He getsie een error: " + error.message);
  }
  return null;
}


export async function getAlbumTracks(albumId:string) {
  console.log("Getting album tracks for: " + albumId)
  const payload = {
    "endpoint": "MUZIEKWEB_INTERNAL",
    "parameters": [
      {
        "key": "album",
        "value": "https://data.muziekweb.nl/Link/" + albumId
      }
    ]
  }
  try {
    const response = await fetch(TRACKS_QUERY_URL, { //  + "?refreshCache=False"
      method: "post",
      headers: {
          "Content-Type": "application/json",
          "Authorization" : "Basic aGFja2Fsb2RfMjAyNTpIQUNLLWxvb2Z0LTReX19ebWFhay1lci1XYXQtdmFu"
      },
      body: JSON.stringify(payload),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result
  } catch (error) {
    console.error("He getsie een error: " + error.message);
  }
  return null;
}