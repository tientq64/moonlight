import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { SingleArticleResponse } from "./types"

export const useGetArticle = () => {
   const axios: AxiosInstance = useAxios()

   const getArticle = (slug: string): Promise<AxiosResponse<SingleArticleResponse>> => {
      return axios.get(`articles/${slug}`)
   }

   return getArticle
}
