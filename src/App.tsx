import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { store } from "./store"

import { Layout } from "./layouts"
import { ArticlePage, EditorPage, HomePage, LoginPage, RegisterPage, SettingsPage, ProfilePage } from "./pages"
import { Provider } from "react-redux"

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
         },
         {
            path: "article/:slug",
            element: <ArticlePage />
         },
         {
            path: "profile/:username",
            element: <ProfilePage />
         },
         {
            path: "settings",
            element: <SettingsPage />
         },
         {
            path: "editor",
            element: <EditorPage />
         },
         {
            path: "*",
            element: <Navigate to="/" replace />
         }
      ]
   }
])

export function App() {
   return (
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   )
}
