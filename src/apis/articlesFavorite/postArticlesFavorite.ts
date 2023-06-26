import { axiosApi } from "../axiosApi"

export const postArticlesFavorite = (slug: string) => {
   return (
      axiosApi.post(`articles/${slug}/favorite`)
   )
}
