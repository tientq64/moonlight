import { axiosApi } from "../axiosApi"

export const getArticlesSlug = (slug: string) => {
   return (
      axiosApi.get(`articles/${slug}`)
   )
}
