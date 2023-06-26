import { axiosApi } from "../axiosApi"

export const getArticlesSlugComments = (slug: string) => {
   return (
      axiosApi.get(`articles/${slug}/comments`)
   )
}
