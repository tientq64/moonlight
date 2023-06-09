import { RouterProvider, createBrowserRouter } from "react-router-dom"

import { Layout } from "./layouts"
import { HomePage, LoginPage, RegisterPage } from "./pages"

const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            index: true,
            element: <HomePage />
         },
         {
            path: "login",
            element: <LoginPage />
         },
         {
            path: "register",
            element: <RegisterPage />
         }
      ]
   }
])

export function App() {
   return (
      <RouterProvider router={router}></RouterProvider>
   )
}
