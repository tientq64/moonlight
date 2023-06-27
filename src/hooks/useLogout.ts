import { useUser } from "./useUser"

export const useLogout = () => {
   const [user, setUser] = useUser()

   const logout = (): void => {
      setUser(null)
   }
   return logout
}
