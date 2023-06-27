import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { setUser as setUserAction } from "../store/reducers/user"
import { IUser } from "../apis"

type UserState = IUser | null
type SetUserState = (userState: UserState) => void

export const useUser = (): [UserState, any] => {
   const user: UserState = useSelector((state: RootState) => state.user.user)
   const dispatch = useDispatch()

   const setUser: SetUserState = (userState) => {
      dispatch(setUserAction(userState))
   }

   return [user, setUser]
}
