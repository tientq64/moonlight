import { createBrowserRouter } from "react-router-dom"
import { Layout } from "../../layouts"
import {
   ArticlePage,
   EditorPage,
   HomePage,
   LoginPage,
   NotFoundPage,
   ProfilePage,
   RegisterPage,
   SettingsPage
} from "../../pages"

export const router = createBrowserRouter([
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
            path: "editor/:slug?",
            element: <EditorPage />
         },
         {
            path: "*",
            element: <NotFoundPage />
         }
      ]
   }
])
