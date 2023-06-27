import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { SingleArticleResponse, UpdateArticleRequest } from "./types"

export const useUpdateArticle = () => {
   const axios: AxiosInstance = useAxios()

   const updateArticle = (
      slug: string,
      body: UpdateArticleRequest
   ): Promise<AxiosResponse<SingleArticleResponse>> => {
      return axios.put(`articles/${slug}`, body)
   }

   return updateArticle
}
