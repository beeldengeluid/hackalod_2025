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

export const YEARS_FOR_FESTVAL = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>

# years for a festival
select ?year
where
{
    ?festival a schema:Festival ;
	    schema:name ?name ;
    	schema:startDate ?startDate ;
    	schema:additionalType ?type .
    FILTER (?type = "FESTIVAL_NAME") 
    BIND(YEAR(?startDate) as ?year)
}
ORDER BY ?startDate
`


const RANDOM_ALBUM = `
prefix sdo: <https://schema.org/>

SELECT * WHERE {
?uri a sdo:MusicAlbum
} 
ORDER BY RAND()
LIMIT 300`


// MUST BE RUN ON INTERNAL MW via search API
export const RANDOM_FAMOUS_ALBUM = `
prefix vocab: <https://data.muziekweb.nl/vocab/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
  prefix sdo: <https://schema.org/>
SELECT DISTINCT ?person ?person_name ?album
where {
  ?person rdf:type vocab:ImportantPerformer ;
    rdfs:label ?person_name ;
    rdf:type vocab:PopularPerformer ;
    skos:prefLabel ?name1 ;
    vocab:album ?album .
}
order by rand()
limit 100`

export const RANDOM_TRACK_FROM_ALBUM = `
prefix vocab: <https://data.muziekweb.nl/vocab/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
prefix sdo: <https://schema.org/>
SELECT DISTINCT ?track_uri ?track_title ?embed_url
where {
  ?track sdo:inAlbum <FAMOUS_ALBUM> ;
    skos:prefLabel ?track_title ; 
    BIND(IRI(REPLACE(STR(?track), "https://data.muziekweb.nl/Link/", "https://www.muziekweb.nl/embed/")) AS ?embed_url)
  
}
order by rand()
limit 1`

export const BAND_FROM_PLACE = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>

SELECT ?location ?locationLabel ?performerName
WHERE {
  ?performer a schema:MusicGroup .
    ?performer owl:sameAs ?wikiPerformer .
    ?wikiPerformer wdt:P740 ?location .
    ?location rdfs:label ?locationLabel ;
        geo:hasGeometry/geo:asWKT ?wkt ;
     OPTIONAL { ?performer schema:name ?performerName }
     OPTIONAL { ?performer rdfs:label ?performerName }
     
    BIND("POLYGON ((7.450132782237404 53.488219420821025, 5.934482728991128 53.526576262999555, 4.762809992792825 53.1607830824469, 3.1934134837582917 51.311316239017856, 4.10710323216918 51.21041663847805, 4.924049360159927 51.398583470995476, 5.751744779309121 51.109295471862765, 5.536758956152738 50.71620582483206, 6.106471387515626 50.71620582483206, 6.256961463724224 51.351614079459665, 6.106471387515626 51.81914201552789, 6.880420350875482 51.9253306941452, 7.450132782237404 53.488219420821025))"^^geo:wktLiteral AS ?nlBB) 
	filter(geof:sfWithin(?wkt, ?nlBB))
}
order by rand()
limit 1`

export const RANDOM_PLACES = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>

SELECT (?location AS ?uri) (?locationLabel AS ?label) 
WHERE {
  ?location a geo:Feature ;
    geo:hasGeometry/geo:asWKT ?wkt ;
       rdfs:label ?locationLabel .
  
    BIND("POLYGON ((7.450132782237404 53.488219420821025, 5.934482728991128 53.526576262999555, 4.762809992792825 53.1607830824469, 3.1934134837582917 51.311316239017856, 4.10710323216918 51.21041663847805, 4.924049360159927 51.398583470995476, 5.751744779309121 51.109295471862765, 5.536758956152738 50.71620582483206, 6.106471387515626 50.71620582483206, 6.256961463724224 51.351614079459665, 6.106471387515626 51.81914201552789, 6.880420350875482 51.9253306941452, 7.450132782237404 53.488219420821025))"^^geo:wktLiteral AS ?nlBB) 
	filter(geof:sfWithin(?wkt, ?nlBB))
}
order by rand()
limit 3`

export const LAST_PLACE_TOP2000 = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

# wie stond op de laatste plaats in year
#SELECT ?artist ?artistName ?top2000Year ?top2000Position
SELECT ?artist ?artistName
#FROM <http://hackalod.artsdata.nl/top2000> 
{
	?song a schema:MusicRecording ;
    	schema:datePublished ?year ;
    	schema:name ?name ;
        schema:byArtist ?artist .
        ?wikiArtist owl:sameAs ?artist .
        ?wikiArtist rdfs:label ?artistName .

    ?observation a schema:Observation ;
	    schema:observationAbout ?song ;
	    schema:observationDate ?top2000Year ;
    	schema:value ?top2000Position .
    FILTER (?top2000Position = 2000)
    FILTER (?top2000Year = "TOP_YEAR")
}
order by RAND()
limit 1`

export const NOT_LAST_PLACE_TOP2000 = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

SELECT ?artist ?artistName
#FROM <http://hackalod.artsdata.nl/top2000> 
{
	?song a schema:MusicRecording ;
    	schema:datePublished ?year ;
    	schema:name ?name ;
        schema:byArtist ?artist .
        ?wikiArtist owl:sameAs ?artist .
        ?wikiArtist rdfs:label ?artistName .

    ?observation a schema:Observation ;
	    schema:observationAbout ?song ;
	    schema:observationDate ?top2000Year ;
    	schema:value ?top2000Position .
    FILTER (?top2000Position > 1900)
}
order by RAND()
limit 3`