import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { setUser as setUserAction } from "../../store/reducers/user"
import { IUser } from "../../types"

type User = IUser | null
type SetUser = (userPayload: User) => void

export const useUser = (): [User, any] => {
   const user: User = useSelector(
      (state: RootState) => state.user.user
   )
   const dispatch = useDispatch()

   const setUser: SetUser = (userPayload) => {
      dispatch(setUserAction(userPayload))
   }

   return [user, setUser]
}
