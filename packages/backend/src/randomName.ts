const adjectives = [
	"Betoverende",
	"Bruisende",
	"Fabelachtige",
	"Fameuze",
	"Fantastische",
	"Geinige",
	"Geweldige",
	"Jolige",
	"Kolderieke",
	"Magnifieke",
	"Onvergetelijke",
	"Prachtige",
	"Schitterende",
	"Spetterende",
	"Sprankelende",
	"Stralende",
	"Swingende",
	"Verbluffende",
	"Verfrissende",
	"Verrassende",
	"Vrolijke",
	"Zinderende",
	"Zonnige",
]

const nouns = ["Jaap", "Michel", "Monique", "Roosmarijn", "Willem", "Petra"]

export function generateRandomName(): string {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
	const noun = nouns[Math.floor(Math.random() * nouns.length)]
	return `${adjective} ${noun}`
}
