import { useDispatch } from "react-redux"
import { setUser } from "../../store/reducers/user"

export const useLogout = () => {
   const dispatch = useDispatch()

   return (() => {
      dispatch(setUser(null))
      localStorage.removeItem("userToken")
   })
}
