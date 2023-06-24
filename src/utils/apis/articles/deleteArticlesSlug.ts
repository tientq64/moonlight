import { axiosApi } from "../.."

export const deleteArticlesSlug = (slug: string) => {
   return (
      axiosApi.delete(`articles/${slug}`)
   )
}
