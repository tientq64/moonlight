import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { ProfileResponse } from "./types"

export const useUnfollowUserByUsername = () => {
   const axios: AxiosInstance = useAxios()

   const unfollowUserByUsername = (
      username: string
   ): Promise<AxiosResponse<ProfileResponse>> => {
      return axios.delete(`profiles/${username}/follow`)
   }

   return unfollowUserByUsername
}
