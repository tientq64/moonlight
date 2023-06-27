import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { GetArticlesParams, MultipleArticlesResponse } from "./types"

export const useGetArticles = () => {
   const axios: AxiosInstance = useAxios()

   const getArticles = (
      params: GetArticlesParams
   ): Promise<AxiosResponse<MultipleArticlesResponse>> => {
      return axios.get("articles", {
         params
      })
   }

   return getArticles
}
