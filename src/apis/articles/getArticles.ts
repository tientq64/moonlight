import { axiosApi } from "../axiosApi"

export type GetArticlesParams = {
   limit: number
   offset: number
   tag?: string
   author?: string
   favorited?: string
}

export const getArticles = (params: GetArticlesParams) => {
   return (
      axiosApi.get("articles", { params })
   )
}
