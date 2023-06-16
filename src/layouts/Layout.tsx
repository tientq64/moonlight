import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"

import { Header } from "../components"
import { setUser } from "../store/reducers/user"
import { getUser } from "../utils"

export function Layout() {
   const [loaded, setLoaded] = useState<boolean>(false)
   const dispatch = useDispatch()

   useEffect(() => {
      if (localStorage.userToken) {
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
