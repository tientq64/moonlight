import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { TagsResponse } from "./types"

export const useGetTags = () => {
   const axios: AxiosInstance = useAxios()

   const getTags = (): Promise<AxiosResponse<TagsResponse>> => {
      return axios.get("tags")
   }

   return getTags
}
