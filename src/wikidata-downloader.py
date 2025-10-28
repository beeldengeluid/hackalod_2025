import logging
import os
from time import sleep
import re
import requests
from requests import HTTPError
from requests.adapters import HTTPAdapter, Retry
from datetime import datetime
from rdflib import Graph, URIRef, BNode
from rdflib.namespace import Namespace
from util.base_util import LOG_FORMAT, get_path_from_config, date_time_string


cfg: dict = {
    "LOG_LEVEL": "INFO",  # Levels: DEBUG - INFO - WARNING - ERROR - CRITICAL
    "WIKIDATA_QUERY_SERVICE_URL": "https://query.wikidata.org/bigdata/namespace/wdq/sparql",
    "DATA_DIR": "./data/",
    "FN_LINKSET": "wikidata_muziekweb_matches.csv",
    "WD_MW_QUERY_FILE": "queries/wikidata-muziekweb-downloader.rq",
}

NS_SCHEMA = Namespace("http://schema.org/")
NS_WDT = Namespace("http://www.wikidata.org/prop/direct/")
NS_WDTN = Namespace("http://www.wikidata.org/prop/direct-normalized")
NS_SKOS = Namespace("http://www.w3.org/2004/02/skos/core#")
NS_WIKIBASE = Namespace("http://wikiba.se/ontology#")
NS_BD = Namespace("http://www.bigdata.com/rdf#")
NS_OWL = Namespace("http://www.w3.org/2002/07/owl#")
NS_MUZIEKWEB = Namespace("https://data.muziekweb.nl/Link/")
NS_GEO = Namespace("http://www.opengis.net/ont/geosparql#")
CSV_WIKIDATA_ID = "wikidata_id"
CSV_MUZIEKWEB_ID = "muziekweb_performer_id"

logging.basicConfig(
    level=cfg["LOG_LEVEL"],
    format=LOG_FORMAT,
)
logger = logging.getLogger(__name__)


def get_wd_graph_for_mw_id(mw_id: str = "") -> Graph:
    g = Graph()
    g.bind("schema", NS_SCHEMA, override=True, replace=True)
    try:
        if mw_id:
            result: str = execute_wd_construct_query(
                query=get_query_wikidata_muziekweb_performer(mw_id)
            )
            if result:
                g.parse(data=result, format="application/rdf+xml")
                return g
    except HTTPError:
        raise
    except Exception as e:
        logger.error(str(e))
        sleep(1)
    return g


SELECT_QUERY_MUZIEKWEB_MATCHES = """SELECT ?wikidata_id ?muziekweb_performer_id 
        WHERE { ?wikidata_id wdt:P5882 ?muziekweb_performer_id }
        """


def get_query_wikidata_muziekweb_performer(mw_id: str = "") -> str:
    """Get a CONSTRUCT query that gets wikidata triples for a given Muziekweb id.

    :param mw_id: Muziekweb performer URI.
    :return: a CONSTRUCT query generating a graph matching the query pattern.
    NOTE: dates BC need to be handled, see:
    https://www.wikidata.org/wiki/Help:Dates#Years_BC
    """
    if mw_id == "":
        return ""
    else:
        q_path = get_path_from_config(cfg.get("WD_MW_QUERY_FILE", ""))
        query: str = ""
        if os.path.exists(q_path):
            with open(q_path, "r") as f:
                query = f.read()
        return query.replace("mw_id_value", mw_id)


def wd_mw_matches_to_graph(data: dict = {}) -> Graph:
    """Convert the results to Graph."""
    g = Graph()
    g.bind("schema", NS_SCHEMA, override=True, replace=True)
    try:
        vars = data.get("results", {}).get("bindings", {})
        for item in vars:
            logger.debug(item)
            # {'wikidata_id': {'type': 'uri', 'value': 'http://www.wikidata.org/entity/Q4636299'}, 'muziekweb_performer_id': {'type': 'literal', 'value': 'M00000457368'}}
            wd_id = item.get(CSV_WIKIDATA_ID, {})
            mw_id = item.get(CSV_MUZIEKWEB_ID, {})
            if (
                wd_id
                and wd_id.get("type", "") == "uri"
                and mw_id
                and mw_id.get("type", "") == "literal"
            ):
                g.add(
                    (
                        URIRef(wd_id.get("value", "")),
                        URIRef(NS_OWL + "sameAs"),
                        URIRef(NS_MUZIEKWEB + mw_id.get("value", "")),
                    )
                )
    except TypeError as e:
        logger.error(str(e))
    return g


def execute_wd_select_query(query: str = "") -> dict:
    """Execute the query and return the results.

    Before executing, get configuration for Wikidata request and
    prepare a request.

    Wikidata query service requires a user agent header formatted:
    (
    "<client name>/<version> (<contact information>) "
    "<library/framework name>/<version> [<library name>/<version> ...]"
    )

    See: https://meta.wikimedia.org/wiki/User-Agent_policy
    """
    try:
        wd_url = cfg["WIKIDATA_QUERY_SERVICE_URL"]
        s = requests.Session()
        retries = Retry(
            total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504]
        )
        s.mount(wd_url, HTTPAdapter(max_retries=retries))
        headers = {
            "User-Agent": (
                "Hackalod_2025_Imagine_all_the_people/0.1 "
                "(wmelder@beeldengeluid.nl) requests/2.32"
            )
        }
        wd_params = {"query": query, "format": "json"}
        wd_timeout = 60
        resp = s.get(wd_url, headers=headers, params=wd_params, timeout=wd_timeout)
        logger.debug(resp.url)
        logger.debug(resp.status_code)
        if resp.status_code >= 400:
            logger.error(resp.headers)
            logger.error(resp.reason)
        resp.raise_for_status()
        return resp.json()
    except HTTPError:
        raise


def execute_wd_construct_query(query: str = "") -> str:
    """Execute the query and return the results.

    Before executing, get configuration for Wikidata request and
    prepare a request.

    Wikidata query service requires a user agent header formatted:
    (
    "<client name>/<version> (<contact information>) "
    "<library/framework name>/<version> [<library name>/<version> ...]"
    )

    See: https://meta.wikimedia.org/wiki/User-Agent_policy
    """
    try:
        wd_url = cfg["WIKIDATA_QUERY_SERVICE_URL"]
        s = requests.Session()
        retries = Retry(
            total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504]
        )
        s.mount(wd_url, HTTPAdapter(max_retries=retries))
        headers = {
            "User-Agent": (
                "Hackalod_2025_Imagine_all_the_people/0.1 "
                "(wmelder@beeldengeluid.nl) requests/2.32"
            )
        }
        wd_params = {"query": query, "format": "xml"}
        wd_timeout = 60
        resp = s.get(wd_url, headers=headers, params=wd_params, timeout=wd_timeout)
        logger.debug(resp.url)
        logger.debug(resp.status_code)
        if resp.status_code >= 400:
            logger.error(resp.headers)
            logger.error(resp.reason)
        resp.raise_for_status()
        return resp.text
    except HTTPError:
        raise


def filter_empty_geo_node(g: Graph) -> Graph:
    """Given a Graph, filter out the empty geometry nodes.
    Example: [] a geo:Geometry .
    """
    for s, p, o in g:
        if isinstance(s, BNode) and o == URIRef(str(NS_GEO) + "Geometry"):
            # if not this bnode has also a gwkLiteral as object, remove it
            # [ a geo:Geometry ; geo:asWKT "Point(13.575277777 42.854722222)"^^geo:wktLiteral ]
            if not (s, URIRef(str(NS_GEO) + "asWKT"), None) in g:
                g.remove((s, p, o))
    return g


class WikidataDownloader:
    """Query wikidata for Muziekweb ID's and generate data dump.

    Generate a list of Wikidata entities that have a Muziekweb_ID,
    save these as skos:exactMatch alignment to file and save
    Wikidata resource data to Turtle file.
    """

    def __init__(self, conf):
        logger.debug("Creating %s ..." % self.__class__.__name__)
        self.data_dir = get_path_from_config(cfg["DATA_DIR"])
        logger.info(f"All data is saved in: '{self.data_dir}'")

    def run(self):
        """Start the wikidata data download

        1) Prepare the query to get the Muziekweb ID's from wikidata service.
        2) Get the data using the wikidata query service,
        3) append the Turtle text to one big data file.
        """
        start_load = datetime.now()
        data_path_nt = os.path.join(
            self.data_dir, f"wikidata_muziekweb_data_{date_time_string()}.nt"
        )

        try:
            # 1)  Get the wikidata identifiers
            logger.info("Get the Muziekweb identifiers from Wikidata...")
            mw_ids: list = self.get_wikidata_mw_identifiers()

            # 2) Get the data using the wikidata query service
            logger.info("Get the data using the wikidata query service...")
            with open(data_path_nt, "wt") as f:
                for mw_id_url in mw_ids:
                    result = re.search(
                        r"^https://data.muziekweb.nl/Link/(?P<performer_id>.*)",
                        mw_id_url,
                        re.I,
                    )
                    if result:
                        mw_id: str = result.group("performer_id")
                        logger.info(f"Querying wikidata for: {mw_id}")
                        g = Graph()
                        g.bind("schema", NS_SCHEMA, override=True, replace=True)
                        g.bind("wdt", NS_WDT)
                        g.bind("geo", NS_GEO)
                        g = get_wd_graph_for_mw_id(mw_id)
                        g = filter_empty_geo_node(g)
                        f.write(g.serialize(format="nt11"))

            # # 3) serialize the joined Graph to Turtle file.
            # logger.info("Serialize the data to Turtle file....")
            # g.serialize(data_path)

        except Exception as exc:
            logger.error(str(exc))
        finally:
            logger.info(f"Done. Total time running: {str(datetime.now() - start_load)}")

    def get_wikidata_mw_identifiers(self) -> list:
        """Get SELECT query, select all identifiers and return them in a list.
        # Also, generate the Muziekweb to Wikidata alignment and save to file.
        """
        try:
            result: dict = execute_wd_select_query(
                SELECT_QUERY_MUZIEKWEB_MATCHES  # + "LIMIT 10"
            )
            if result:
                g = wd_mw_matches_to_graph(result)

                alignment_path = os.path.join(
                    self.data_dir,
                    f"wikidata_muziekweb_matches_{date_time_string()}.ttl",
                )
                logger.info(
                    f"Writing Muziekweb to Wikidata alignment to file {alignment_path}"
                )
                g.serialize(alignment_path)

                # return list of muziekweb ids
                return [str(o) for o in g.objects(predicate=None, subject=None)]
        except HTTPError:
            raise
        return []


if __name__ == "__main__":
    """Download information for wikidata entities linked to Muziekweb persons.

    Given the identifiers in Wikidata for resources that have a Muziekweb_ID property
    and given a list of properties to filter, the data is queried from the
    Wikidata query service and stored in a N-triples file.
    The Muziekweb to Wikidata alignment file is also saved.
    """
    start_time = datetime.now()
    wd = WikidataDownloader(conf=cfg)
    wd.run()
    logger.info(f"Done. total processing time: {str(datetime.now() - start_time)}")
