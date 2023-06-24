import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"
import { store } from "../../store"
import { router } from "./router"

export function App() {
   return (
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   )
}
