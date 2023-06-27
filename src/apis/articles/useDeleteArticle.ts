import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"

export const useDeleteArticle = () => {
   const axios: AxiosInstance = useAxios()

   const deleteArticle = (slug: string): Promise<AxiosResponse> => {
      return axios.delete(`articles/${slug}`)
   }

   return deleteArticle
}
