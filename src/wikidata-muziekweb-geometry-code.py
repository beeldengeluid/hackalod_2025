# pip install sparqlwrapper
# https://rdflib.github.io/sparqlwrapper/

import sys
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph

endpoint_url = "https://query.wikidata.org/sparql"

query = """PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
CONSTRUCT {
    ?place a geo:Feature ;
             geo:hasGeometry [ 
               a geo:Geometry ;
                 geo:asWKT ?_coordinates
             ] .
  ?place wdt:P625 ?_coordinates 
    }
WHERE {    
  SELECT DISTINCT ?place ?_coordinates
  WHERE {
  ?s wdt:P19|wdt:P20 ?place ;
     wdt:P5882 ?mw_id
     FILTER ( bound(?mw_id) ) 
  ?place wdt:P625 ?_coordinates 
  }
}"""


def get_results(endpoint_url, query):
    user_agent = (
        "Hackalod_2025_Imagine_all_the_people/0.1 "
        "(wmelder@beeldengeluid.nl) Python/%s.%s"
        % (
            sys.version_info[0],
            sys.version_info[1],
        )
    )
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    return sparql.queryAndConvert()


results = get_results(endpoint_url, query)
if isinstance(results, Graph):
    data_path = "./data/wikidata_muziekweb_geo_data.nt"
    results.serialize(data_path)
