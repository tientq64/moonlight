import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { UserResponse } from "./types"

export const useGetCurrentUser = () => {
   const axios: AxiosInstance = useAxios()

   const getCurrentUser = (): Promise<AxiosResponse<UserResponse>> => {
      return axios.get("user")
   }

   return getCurrentUser
}
