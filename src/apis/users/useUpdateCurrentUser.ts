import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { UpdateUserRequest, UserResponse } from "./types"

export const useUpdateCurrentUser = () => {
   const axios: AxiosInstance = useAxios()

   const updateCurrentUser = (
      body: UpdateUserRequest
   ): Promise<AxiosResponse<UserResponse>> => {
      return axios.put("user", body)
   }

   return updateCurrentUser
}
