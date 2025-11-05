import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./styles.css"
import { StrictMode } from "react"

const rootElement = document.getElementById("app")

if (!rootElement) {
	throw new Error("Root element with id 'app' was not found")
}

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
)
