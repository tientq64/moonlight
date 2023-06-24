import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"
import { Header } from "../components"
import { setUser } from "../store/reducers/user"
import { getUser } from "../utils"

type UserToken = string | null

const userToken: UserToken = localStorage.getItem("userToken")

export const Layout = () => {
   const [loaded, setLoaded] = useState<boolean>(false)
   const dispatch = useDispatch()

   useEffect(() => {
      if (userToken) {
         getUser()
            .then((response) => {
               const { user } = response.data
               dispatch(setUser(user))
               setLoaded(true)
            })
      } else {
         setLoaded(true)
      }
   }, [])

   return (
      <div>
         {loaded && (
            <>
               <Header />
               <Outlet />
            </>
         )}
      </div>
   )
}
