import { axiosApi } from "."

interface IParams {
   limit: number
   offset: number
   tag?: string
   author?: string
   favorited?: string
}

export const getArticles = (params: IParams) => {
   return (
      axiosApi.get("articles", { params })
   )
}
