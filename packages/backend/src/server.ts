import { createApp } from "./app"

const port = Number(process.env.PORT ?? 3000)
const app = createApp()

app.listen(port, () => {
	// Log so it's easy to spot the running dev server port.
	console.log(`Backend listening on http://localhost:${port}`)
})
