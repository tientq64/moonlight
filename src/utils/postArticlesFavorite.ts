import { axiosApi } from "."

export const postArticlesFavorite = (slug: string) => {
   return (
      axiosApi.post(`articles/${slug}/favorite`)
   )
}
