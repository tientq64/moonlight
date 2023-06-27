import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { LoginUserRequest, UserResponse } from "./types"

export const useLogin = () => {
   const axios: AxiosInstance = useAxios()

   const login = (
      body: LoginUserRequest
   ): Promise<AxiosResponse<UserResponse>> => {
      return axios.post("users/login", body)
   }

   return login
}
