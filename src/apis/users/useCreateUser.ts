import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { NewUserRequest, UserResponse } from "./types"

export const useCreateUser = () => {
   const axios: AxiosInstance = useAxios()

   const createUser = (
      body: NewUserRequest
   ): Promise<AxiosResponse<UserResponse>> => {
      return axios.post("users", body)
   }

   return createUser
}
