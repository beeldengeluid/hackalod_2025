import path from 'path'
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@hackalod2025/common": path.resolve(__dirname, "../backend/src/common"),
		}
	},
	server: {
		proxy: {
			"/random-name": "http://localhost:3000",
		},
	},
})
