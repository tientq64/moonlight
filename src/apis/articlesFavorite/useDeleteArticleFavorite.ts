import { AxiosInstance, AxiosResponse } from "axios"
import { SingleArticleResponse } from "../articles/types"
import { useAxios } from "../useAxios"

export const useDeleteArticleFavorite = () => {
   const axios: AxiosInstance = useAxios()

   const deleteArticleFavorite = (
      slug: string
   ): Promise<AxiosResponse<SingleArticleResponse>> => {
      return axios.delete(`articles/${slug}/favorite`)
   }

   return deleteArticleFavorite
}
