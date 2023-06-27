import { AxiosInstance, AxiosResponse } from "axios"
import { SingleArticleResponse } from "../articles/types"
import { useAxios } from "../useAxios"

export const useCreateArticleFavorite = () => {
   const axios: AxiosInstance = useAxios()

   const createArticleFavorite = (
      slug: string
   ): Promise<AxiosResponse<SingleArticleResponse>> => {
      return axios.post(`articles/${slug}/favorite`)
   }

   return createArticleFavorite
}
