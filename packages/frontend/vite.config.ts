import path from 'path'
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@lodster/common": path.resolve(__dirname, "../backend/src/common"),
			'@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
		}
	},
	server: {
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
})
