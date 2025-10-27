from rdflib import Graph, RDF, Namespace, Literal, BNode

GEO = Namespace("http://www.opengis.net/ont/geosparql#")
SCHEMA = Namespace("https://schema.org/")
EX = Namespace("http://example.org/")

cities = {
    "Utrecht": (5.1214, 52.0907),
    "Eindhoven": (5.4790, 51.4416),
    "Haarlem": (4.6462, 52.3874),
    "Groningen": (6.5665, 53.2194),
    "Arnhem": (5.8987, 51.9851),
    "Maastricht": (5.6900, 50.8514),
    "Rotterdam": (4.4792, 51.9244),
    "DenHaag": (4.3007, 52.0705)
}

g = Graph()

for name, (lon, lat) in cities.items():
    
    city = EX[name]

    geom_node = BNode()
    wkt = f"POINT ({lon} {lat})"

    g.add((city, RDF["type"], GEO.Feature))
    g.add((city, RDF["type"], SCHEMA.Place))
    g.add((city, SCHEMA.name, Literal(name)))
    g.add((city, GEO.hasGeometry, geom_node))

    g.add((geom_node, RDF["type"], GEO.Geometry))
    g.add((geom_node, GEO.asWKT, Literal(wkt, datatype=GEO.wktLiteral)))

g.serialize("example_geo.ttl", format="turtle")
print("Saved geo RDF")
