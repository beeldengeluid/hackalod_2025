from rdflib import Graph, Namespace, Literal

GEO = Namespace("http://www.opengis.net/ont/geosparql#")
SCHEMA = Namespace("https://schema.org/")
EX = Namespace("http://example.org/city/")

cities = {
    "Utrecht": (5.1214, 52.0907),
    "Eindhoven": (5.4790, 51.4416),
    "Haarlem": (4.6462, 52.3874),
    "Groningen": (6.5665, 53.2194),
    "Arnhem": (5.8987, 51.9851),
    "Maastricht": (5.6900, 50.8514),
    "Rotterdam": (4.4792, 51.9244),
    "DenHaag": (4.3007, 52.0705),
}

g = Graph()

for name, (lon, lat) in cities.items():
    city = EX[name]
    geo_node = EX[f"{name}_Geo"]
    geom_node = EX[f"{name}_Geometry"]
    wkt = f"POINT ({lon} {lat})"

    g.add((city, SCHEMA.name, Literal(name)))
    g.add((city, GEO.hasGeometry, geom_node))
    g.add((city, SCHEMA.geo, geo_node))
    g.add((city, SCHEMA["type"], SCHEMA.Place))
    g.add((city, GEO["type"], GEO.Feature))

    g.add((geo_node, SCHEMA["type"], SCHEMA.GeoCoordinates))
    g.add((geo_node, SCHEMA.latitude, Literal(lat)))
    g.add((geo_node, SCHEMA.longitude, Literal(lon)))

    g.add((geom_node, GEO["type"], GEO.Geometry))
    g.add((geom_node, GEO.asWKT, Literal(wkt, datatype=GEO.wktLiteral)))

g.serialize("dutch_cities_schema_geo.ttl", format="turtle")
print("Saved RDF with Schema.org + GeoSPARQL support")
