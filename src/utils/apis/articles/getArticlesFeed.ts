import { axiosApi } from "../.."

type Params = {
   limit: number
   offset: number
}

export const getArticlesFeed = (params: Params) => {
   return (
      axiosApi.get("articles/feed", { params })
   )
}
