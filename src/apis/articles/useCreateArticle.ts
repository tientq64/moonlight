import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { NewArticleRequest, SingleArticleResponse } from "./types"

export const useCreateArticle = () => {
   const axios: AxiosInstance = useAxios()

   const createArticle = (
      body: NewArticleRequest
   ): Promise<AxiosResponse<SingleArticleResponse>> => {
      return axios.post("articles", body)
   }

   return createArticle
}
