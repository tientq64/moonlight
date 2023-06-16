import { axiosApi } from "."

export const deleteArticlesFavorite = (slug: string) => {
   return (
      axiosApi.delete(`articles/${slug}/favorite`)
   )
}
