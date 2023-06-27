import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { ProfileResponse } from "./types"

export const useFollowUserByUsername = () => {
   const axios: AxiosInstance = useAxios()

   const followUserByUsername = (
      username: string
   ): Promise<AxiosResponse<ProfileResponse>> => {
      return axios.post(`profiles/${username}/follow`)
   }

   return followUserByUsername
}
