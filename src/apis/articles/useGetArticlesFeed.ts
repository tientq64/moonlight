import { AxiosInstance, AxiosResponse } from "axios"
import { GetArticlesFeedParams, MultipleArticlesResponse } from "./types"
import { useAxios } from "../useAxios"

export const useGetArticlesFeed = () => {
   const axios: AxiosInstance = useAxios()

   const getArticlesFeed = (
      params: GetArticlesFeedParams
   ): Promise<AxiosResponse<MultipleArticlesResponse>> => {
      return axios.get("articles/feed", {
         params
      })
   }

   return getArticlesFeed
}
