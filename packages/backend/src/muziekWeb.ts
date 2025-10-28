const SPARQL_URL = "https://data.muziekweb.nl/_api/datasets/MuziekwebOrganization/Muziekweb/services/Muziekweb/sparql";
const DUMMY_QUERY = {"query":"select * where {?subj ?pred ?obj.} limit 10"};
const TRACKS_QUERY_URL = "https://sandbox-search.rdlabs.beeldengeluid.nl/api/v1.1/lod/grlc/beeldengeluid/sparql-queries/getMuziekAlbumTracks/"
const DUMMY_TRACK_QUERY = {
  "endpoint": "MUZIEKWEB_INTERNAL",
  "parameters": [
    {
      "key": "album",
      "value": "https://data.muziekweb.nl/Link/JE44551"
    }
  ]
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
          "Authorization" : "Basic YOURAUTH"
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