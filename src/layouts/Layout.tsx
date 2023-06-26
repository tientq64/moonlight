import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Header } from "../components"

export const Layout = () => {
   return (
      <div>
         <Header />
         <Outlet />
         <ToastContainer
            position="bottom-right"
         />
      </div>
   )
}
