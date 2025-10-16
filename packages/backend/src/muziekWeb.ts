const SPARQL_URL = "https://data.muziekweb.nl/_api/datasets/MuziekwebOrganization/Muziekweb/services/Muziekweb/sparql";
const DUMMY_QUERY = {"query":"select * where {?s ?p ?o.} limit 10"};

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