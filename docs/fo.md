# Functioneel ontwerp LODster/Trivster/Hitstriant

[M] must
[S] should
[c] could
[W] would

## 1. Doel en context
- Mix van Triviant (Trivia) en Hitster (muzikale/volgorde uitdagingen) als hybride quizervaring. [M]
- Educatieve en entertainende manier om Linked Open Data (LOD) te verkennen via GraphDB. [M]
- Te spelen als individu [M] of in een team [C]

## 2. Scope en uitgangspunten
- Vraag-antwoorden worden samengesteld uit LOD (multi-bron). [M]
- MVP richt zich op eenvoudige vraag-antwoord rondes gebaseerd op Triviant-stijl. [M]
- Volgende iteratie richt zich op de meer uitdagende Hitster-variant, waarbij het antwoord op een tijdlijn geplaatst dient te worden. [M]
- Verdere iteraties voegen moeilijkere vraag-type toe, zoals kaart interacties. [S]
- Anonieme deelname in MVP [M]; evolutie naar geregistreerde profielen, persistentie van scores en _leader boards_ [S].
- Alle vragen, antwoorden en spelstatistieken leven in GraphDB [M]
- Vragen hebben een moeilijkheid [S] en scope [C]. Een scope kan een bepaalde periode, stijl of regio zijn. Dit is natuurlijk een geweldige feature, maar de data moet daarvoor wel op orde zijn.

## 3. Vraagtypen en regels
- **Trivia (Triviant-stijl)**
	- Meerkeuze
	- Geo- of cultuurvragen uit 1-2 LOD bronnen (bijv. Muziekweb + Wikidata).
- **Volgorde (Hitster-stijl)**
	- Plaats item op tijdlijn
	- Plaats items in chronologische volgorde (bijv. releases, gebeurtenissen).
- **Locatievragen**
	- Plaats item op kaart (bijv. geboorteplaats artiest, locatie evenement).
	- Gebruik kaartcomponent met tolerantiezone om correctheid te bepalen.


## 4. Spelverloop
1. Spel toont introductie [C]
2. Gebruiker kiest moeilijkheid en scope
3. Elke ronde selecteert de engine een vraag op basis van vooraf gekozen moeilijkheid en scope.
4. Speler(s) beantwoord(t/en) binnen tijdslimiet; feedback en score direct zichtbaar.
5. Quiz eindigt na vooraf ingestelde rondes of tijd; eindscore en ranking worden getoond.