import ReactDOM from "react-dom/client"

import { App } from "./App"

import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "animate.css"
import "./index.scss"

const root = ReactDOM.createRoot(
   document.getElementById("root") as HTMLElement
)
root.render(
   <App />
)
