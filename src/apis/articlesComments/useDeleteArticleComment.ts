import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"

export const useDeleteArticleComment = () => {
   const axios: AxiosInstance = useAxios()

   const deleteArticleComment = (
      slug: string,
      commentId: number
   ): Promise<AxiosResponse> => {
      return axios.delete(`articles/${slug}/comments/${commentId}`)
   }

   return deleteArticleComment
}
