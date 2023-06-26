import { axiosApi } from "../axiosApi"

export const deleteArticlesSlug = (slug: string) => {
   return (
      axiosApi.delete(`articles/${slug}`)
   )
}
