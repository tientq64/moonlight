import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { MultipleCommentsResponse } from "./types"

export const useGetArticleComments = () => {
   const axios: AxiosInstance = useAxios()

   const getArticleComments = (
      slug: string
   ): Promise<AxiosResponse<MultipleCommentsResponse>> => {
      return axios.get(`articles/${slug}/comments`)
   }

   return getArticleComments
}
