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
order by rand()
limit 50`

// Queen = <https://data.muziekweb.nl/Link/M00000071922>
export const LIST_PERONS_INFLUENCED_BY_X = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix vocab: <https://data.muziekweb.nl/vocab/>
select (?person AS ?uri) (?sLabel as ?label) ?oLabel
where {
  VALUES ?person {PERSON_URI}
  ?person vocab:influencedBy ?o .
    ?person rdfs:label ?sLabel .
    ?person rdfs:label ?oLabel .
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

export const LIST_FAMOUS_PERSONS = `
prefix vocab: <https://data.muziekweb.nl/vocab/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?s1 ?name1
where {
  ?s1 rdf:type vocab:ImportantPerformer ;
    rdf:type vocab:PopularPerformer ;
    skos:prefLabel ?name1 ;

}
order by rand()
limit 100`


// performers who performed at festival A in year B
export const PERFORMERS_AT_FESTVAL = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>

select (?performer as ?uri) (?performerName as ?label)
where
{
    ?performer a schema:MusicGroup .
    # in een optreden

    ?performance schema:performer ?performer ;
    	 a schema:PerformingArtsEvent .

	# op een festival
	?festival a schema:Festival ;
		schema:subEvent ?performance ;
		schema:startDate ?startDate ;
        schema:additionalType ?type .
        
        BIND (YEAR(?startDate) as ?startYear) .
		OPTIONAL {?performer schema:name ?performerName }.
        OPTIONAL {?performer rdfs:label ?performerName }.

        FILTER(?type = 'FESTIVAL_NAME') .
	    FILTER(?startYear = FESTIVAL_YEAR) 

}
ORDER BY RAND()
LIMIT 3`

export const PERFORMERS_NOT_AT_FESTVAL = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>

SELECT (?performer AS ?uri) (?performerName AS ?label) 
WHERE {
  ?performer a schema:MusicGroup .

  # exclude performers who performed at the given festival
  FILTER NOT EXISTS {
    ?performance a schema:PerformingArtsEvent ;
                 schema:performer ?performer .
    ?festival a schema:Festival ;
              schema:subEvent ?performance ;
              schema:startDate ?startDate ;
              schema:additionalType ?type .

    BIND(YEAR(?startDate) AS ?startYear)
    FILTER(?type = 'FESTIVAL_NAME')
    FILTER(?startYear = FESTIVAL_YEAR)
  }

  OPTIONAL { ?performer schema:name ?performerName }
  OPTIONAL { ?performer rdfs:label ?performerName }
}
ORDER BY RAND()
LIMIT 1`


const RANDOM_ALBUM = `
prefix sdo: <https://schema.org/>

SELECT * WHERE {
?uri a sdo:MusicAlbum
} 
ORDER BY RAND()
LIMIT 300`


const RANDOM_FAMOUS_TRACK = `
prefix vocab: <https://data.muziekweb.nl/vocab/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
  prefix sdo: <https://schema.org/>
SELECT DISTINCT ?s1 ?name1 ?album ?track
where {
  ?s1 rdf:type vocab:ImportantPerformer ;
    rdf:type vocab:PopularPerformer ;
    skos:prefLabel ?name1 ;
    vocab:album ?album .
  ?track sdo:inAlbum ?album
  
  
  
    

}
order by rand()
limit 100`

