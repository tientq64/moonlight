import { AxiosInstance, AxiosResponse } from "axios"
import { useAxios } from "../useAxios"
import { NewCommentRequest, SingleCommentResponse } from "./types"

export const useCreateArticleComment = () => {
   const axios: AxiosInstance = useAxios()

   const createArticleComment = (
      slug: string,
      body: NewCommentRequest
   ): Promise<AxiosResponse<SingleCommentResponse>> => {
      return axios.post(`articles/${slug}/comments`, body)
   }

   return createArticleComment
}
