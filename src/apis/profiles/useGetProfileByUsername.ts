import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { ProfileResponse } from "./types"

export const useGetProfileByUsername = () => {
   const axios: AxiosInstance = useAxios()

   const getProfileByUsername = (
      username: string
   ): Promise<AxiosResponse<ProfileResponse>> => {
      return axios.get(`profiles/${username}`)
   }

   return getProfileByUsername
}
