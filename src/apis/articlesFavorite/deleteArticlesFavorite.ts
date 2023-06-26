import { axiosApi } from "../axiosApi"

export const deleteArticlesFavorite = (slug: string) => {
   return (
      axiosApi.delete(`articles/${slug}/favorite`)
   )
}
