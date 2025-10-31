export const LIST_PEOPLE_THAT_LIVED_IN_YEAR = `prefix vocab: <https://data.muziekweb.nl/vocab/>
prefix schema: <http://schema.org/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select distinct (?person AS ?uri) ?label
where {
values ?type {
    schema:Person
}
values ?year {
    "1970"^^xsd:gYear
}
?person rdf:type ?type .
?person rdfs:label ?label .
?person vocab:beginYear ?bYear ;
    vocab:endYear ?eYear
filter((?bYear <= ?year) && !(?eYear < ?year))

}
order by asc(?bYear)
limit 100`

// Queen = <https://data.muziekweb.nl/Link/M00000071922>
export const LIST_PERONS_INFLUENCED_BY_X = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix vocab: <https://data.muziekweb.nl/vocab/>
select *
where {
  VALUES ?s {PERSON_URI}
  ?s vocab:influencedBy ?o .
    ?s rdfs:label ?sLabel .
    ?o rdfs:label ?oLabel .
} 
limit 100`

// just list a number of randomized persons
export const LIST_PERSONS = `prefix vocab: <https://data.muziekweb.nl/vocab/>
prefix schema: <http://schema.org/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select DISTINCT (?person AS ?uri) ?label 
WHERE {
  VALUES ?type {
    schema:Person
    vocab:Performer 
    vocab:PopularPerformer 
    vocab:ClassicalPerformer 
    vocab:ImportantPerformer 
  }
  ?person rdf:type ?type . 
  ?person rdfs:label ?label  
}
order by rand() 
limit 100`