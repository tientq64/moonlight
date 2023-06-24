import { axiosApi } from "../.."

export const getArticlesSlug = (slug: string) => {
   return (
      axiosApi.get(`articles/${slug}`)
   )
}
